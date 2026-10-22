// The MTF baseline: the members minor 1 of the contract added, the report that is rendered from them and the check
// of a recorded rung. The baselines are the contract's fixture and those of the R5 and R5g stand-ins, engines that
// know no optics: every number is synthetic, and what a table is expected to show is taken from the kept values.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { MTF_BASELINE, baselineText, buildBaseline, parseBaseline } from "../../src/baseline/build.ts";
import { checkBaseline, checkFails, stateText, summarizeChanges } from "../../src/baseline/check.ts";
import { buildMtfBaselineReport, renderMtfBaselineReport } from "../../src/baseline/mtfReport.ts";
import { renderBaselineReport } from "../../src/baseline/report.ts";
import { baselineProblems } from "../../src/contract/baseline.ts";
import type { Baseline } from "../../src/contract/baseline.ts";
import { validateKind } from "../../src/contract/schemas.ts";
import { CONTRACT_VERSION, CONTRACT_VERSION_1_1 } from "../../src/contract/version.ts";
import { NOT_COVERED, wordingProblems } from "../../src/report/wording.ts";
import { BASELINE_MTF, BASELINE_RAYS, edited } from "../contract/corpus.ts";
import { tempDir } from "../core/support.ts";
import { R5_GOLDEN, R5_POLICY, r5Cycle } from "../report/r5Fixture.ts";
import { R5G_GOLDEN, R5G_POLICY, r5gCycle } from "../report/r5gFixture.ts";
import { mtfGoldenFile } from "../report/support.ts";

const R5 = "/runs/0/rungs/0";

function changed(pointer: string, replacement: unknown, base: Baseline = BASELINE_MTF): Baseline {
  return edited(base, pointer, replacement) as Baseline;
}

test("the MTF baseline fixture keeps the rules of a baseline, and each rule of the members minor 1 added", () => {
  assert.deepEqual(validateKind("baseline", BASELINE_MTF), []);
  assert.deepEqual(baselineProblems(BASELINE_MTF), []);
  assert.deepEqual(parseBaseline(baselineText(BASELINE_MTF)), { baseline: BASELINE_MTF });
  const [set] = BASELINE_MTF.runs[0].rungs[0].sets ?? [];
  const broken: readonly (readonly [Baseline, RegExp])[] = [
    [changed("/contract", CONTRACT_VERSION), /^it states the contract 1\.0 and has a member that minor 1 added$/],
    [changed(`${R5}/sets`, [set, set]), /it keeps 2 sets; the rung has 1 requests/],
    [changed(`${R5}/sets/0/participants/0/engine`, "zz"), /set 0: its engines are out of order or listed twice/],
    [changed(`${R5}/sets/0/pairs/1/b`, "absent"), /set 0: lv and absent are not two of its engines in order/],
    [changed(`${R5}/sets/0/pairs/2`, set.pairs[0]), /set 0: its pairs are out of order or listed twice/],
    [changed(`${R5}/steps/0/engine`, "ref"), /step fft512 is of ref, which is no engine of the rung/],
    [changed(`${R5}/pairs/0/metrics/0/measured`, 2), /mtfOnAxis\.maxAbs is measured in 2 requests; the rung has 1/],
  ];
  for (const [baseline, pattern] of broken) {
    assert.deepEqual(validateKind("baseline", baseline), [], String(pattern));
    assert.ok(
      baselineProblems(baseline).some((problem) => pattern.test(problem)),
      `${String(pattern)}: ${baselineProblems(baseline).join("; ")}`,
    );
  }
  // A baseline without those members states the contract it always did, and is none the worse for it.
  assert.equal(BASELINE_RAYS.contract, CONTRACT_VERSION);
  assert.deepEqual(baselineProblems(BASELINE_RAYS), []);
});

test("an MTF baseline of a run keeps each request, counts where a metric was measured, and tells a step apart", async (t) => {
  const { manifest, comparisons } = await r5Cycle(tempDir(t));
  const plain = buildBaseline(manifest, comparisons, R5_POLICY);
  const mtf = buildBaseline(manifest, comparisons, R5_POLICY, MTF_BASELINE);
  assert.equal(plain.contract, CONTRACT_VERSION);
  assert.equal(mtf.contract, CONTRACT_VERSION_1_1);
  assert.deepEqual(parseBaseline(baselineText(mtf)), { baseline: mtf });
  // Without the option nothing of minor 1 is written: the rays baselines keep their bytes.
  assert.doesNotMatch(baselineText(plain), /"(sets|steps|bands|measured)"/);

  assert.deepEqual(
    mtf.runs.map((run) => run.name),
    manifest.runs.map((run) => run.name),
  );
  let steps = 0;
  for (const run of mtf.runs) {
    const [rung] = run.rungs;
    assert.equal(rung.rung, "r5");
    assert.equal(rung.sets?.length, rung.requests);
    assert.deepEqual(rung.bands, {
      "chiefLanding.maxAbs": R5_POLICY.rungs.r5.metrics["chiefLanding.maxAbs"].attention,
      "mtfOffAxis.maxAbs": R5_POLICY.rungs.r5.metrics["mtfOffAxis.maxAbs"].attention,
      "mtfOnAxis.maxAbs": R5_POLICY.rungs.r5.metrics["mtfOnAxis.maxAbs"].attention,
    });
    // A kept request is the comparison's own: its engines with what they record, its pairs with their figures.
    const compared = comparisons.comparisons.find((set) => set.run === run.name && set.mode === "pairwise");
    assert.ok(compared);
    assert.deepEqual(
      rung.sets?.[0].participants.map(({ engine, recorded }) => [engine, recorded]),
      compared.participants.map(({ engine, recorded }) => [engine, recorded]),
    );
    for (const pair of rung.pairs) {
      for (const metric of pair.metrics)
        assert.equal(metric.measured, 1, `${run.name} ${pair.a} ${pair.b} ${metric.name}`);
    }
    // The jobs of a later step are counted apart, and are no part of how the engine's own jobs ended.
    const later = manifest.jobs.filter((job) => job.run === run.name && job.step !== undefined);
    assert.deepEqual(
      rung.steps ?? [],
      later.map((job) => ({ engine: job.engine, step: job.step, jobs: 1, status: job.status })),
    );
    steps += later.length;
  }
  assert.ok(steps > 0, "the fixture asks an engine once more");

  // A step that failed leaves the support of its engine as its first answers ended.
  const failed = {
    ...manifest,
    jobs: manifest.jobs.map((job) =>
      job.step === undefined ? job : { ...job, status: "error" as const, storeKey: null, error: { code: "timeout" } },
    ),
  };
  const withFailure = buildBaseline(failed, comparisons, R5_POLICY, MTF_BASELINE);
  const stepped = withFailure.runs.flatMap((run) => run.rungs).filter((rung) => rung.steps !== undefined);
  assert.ok(stepped.length > 0);
  for (const rung of stepped) {
    assert.deepEqual(
      rung.steps?.map(({ status, detail }) => [status, detail]),
      [["error", "timeout"]],
    );
    assert.deepEqual(
      rung.support,
      mtf.runs.flatMap((run) => run.rungs).find((each) => each.steps !== undefined)?.support,
    );
    assert.ok(rung.support.every((support) => support.status === "ok"));
  }
  // The option of rungs leaves out what it does not name.
  assert.ok(
    buildBaseline(manifest, comparisons, R5_POLICY, { rungs: ["r4"] }).runs.every((run) => run.rungs.length === 0),
  );
});

for (const [golden, cycle, policy, rungId] of [
  [R5_GOLDEN, r5Cycle, R5_POLICY, "r5"],
  [R5G_GOLDEN, r5gCycle, R5G_POLICY, "r5g"],
] as const) {
  test(`the MTF report of ${golden} is rendered from the baseline alone, and is the golden file`, async (t) => {
    const { manifest, comparisons } = await cycle(tempDir(t));
    const baseline = buildBaseline(manifest, comparisons, policy, MTF_BASELINE);
    // From the text of the baseline and nothing else: what `lvrtc verify` does.
    const read = parseBaseline(baselineText(baseline));
    assert.ok("baseline" in read);
    const rendered = renderMtfBaselineReport(read.baseline);
    assert.deepEqual(renderMtfBaselineReport(baseline), rendered);
    assert.equal(rendered.markdown, readFileSync(mtfGoldenFile(golden), "utf8"));
    assert.deepEqual(wordingProblems(rendered.markdown), []);
    for (const sentence of NOT_COVERED) assert.ok(rendered.markdown.includes(`- ${sentence}`), sentence);

    const report = buildMtfBaselineReport(baseline);
    assert.equal(report.contract, CONTRACT_VERSION_1_1);
    const [table] = report.tables;
    assert.equal(table.rung, rungId);
    assert.equal(table.kind, rungId === "r5g" ? "geometric" : "diffraction");
    // Every value of a row is the kept one of its engine, and the difference is the first minus the second.
    let seen = 0;
    for (const run of baseline.runs) {
      for (const set of run.rungs[0].sets ?? []) {
        const of = (engine: string) => set.participants.find((each) => each.engine === engine)?.recorded;
        const [lv, optiland] = [of("lv"), of("optiland")];
        for (const row of table.rows.filter((each) => each.run === run.name)) {
          const index = lv?.field.indexOf(row.field) ?? -1;
          if (index < 0) continue;
          for (const value of row.values) {
            const name = `${row.cut}@${value.frequencyPerMm}`;
            assert.equal(value.lv, lv?.[name]?.[index] ?? null, `${run.name} ${name}`);
            const last = row.step === null ? name : `${name}#${row.step}`;
            assert.equal(value.optiland, optiland?.[last]?.[index] ?? null, `${run.name} ${last}`);
            if (value.difference !== null) {
              assert.equal(value.difference, (value.lv as number) - (value.optiland as number));
              seen++;
            }
          }
        }
      }
    }
    assert.ok(seen > 0, "a difference is shown");
    // Every request whose pair is marked is listed, with a figure above its band.
    const marked = baseline.runs.flatMap((run) =>
      run.rungs.flatMap((rung) =>
        (rung.sets ?? []).flatMap((set) =>
          set.pairs.filter((pair) => pair.verdict === "ATTENTION").map(() => run.name),
        ),
      ),
    );
    assert.deepEqual(
      report.attention.map((row) => row.run),
      marked,
    );
    for (const row of report.attention) {
      assert.ok(row.figures.length > 0);
      for (const figure of row.figures) assert.ok(figure.value === null || figure.value > figure.band);
    }
    // The rays report of the same baseline is still the rays report: the members are read by the MTF report alone.
    assert.match(renderBaselineReport(baseline).markdown, /^# Baseline of /);
  });
}

test("check: a recorded rung that moved is MOVED and fails nothing; every figure that changed is listed", async (t) => {
  const { manifest, comparisons } = await r5Cycle(tempDir(t));
  const committed = buildBaseline(manifest, comparisons, R5_POLICY, MTF_BASELINE);
  const same = checkBaseline(committed, committed, R5_POLICY);
  assert.ok(same.length > 0);
  assert.ok(same.every((record) => record.outcome === "OK" && record.changes === undefined));
  assert.deepEqual(summarizeChanges(same), []);

  const at = committed.runs.findIndex((run) => run.rungs[0].pairs.some((pair) => pair.verdict === "RECORDED"));
  assert.ok(at >= 0, "the fixture has a pair inside its bands");
  const pairAt = committed.runs[at].rungs[0].pairs.findIndex((pair) => pair.verdict === "RECORDED");
  const pair = committed.runs[at].rungs[0].pairs[pairAt];
  const metricAt = pair.metrics.findIndex((metric) => Object.hasOwn(R5_POLICY.rungs.r5.metrics, metric.name));
  const metric = pair.metrics[metricAt];
  const band = R5_POLICY.rungs.r5.metrics[metric.name].attention as number;
  const pointer = `/runs/${at}/rungs/0/pairs/${pairAt}`;
  const recordOf = (fresh: Baseline) =>
    checkBaseline(committed, fresh, R5_POLICY).find(
      (record) => record.run === committed.runs[at].name && record.a === pair.a && record.b === pair.b,
    );

  // Less than the band: the record holds, and the change is written down all the same.
  const little = (metric.value as number) + band / 4;
  const nudged = recordOf(changed(`${pointer}/metrics/${metricAt}/value`, little, committed));
  assert.equal(nudged?.outcome, "OK");
  assert.deepEqual(nudged?.changes, [{ name: metric.name, was: metric.value, now: little }]);

  // More than the band, and another verdict: MOVED, which is no failure.
  const much = (metric.value as number) + 2 * band;
  let moved = changed(`${pointer}/metrics/${metricAt}/value`, much, committed);
  moved = changed(`${pointer}/verdict`, "ATTENTION", moved);
  moved = changed(`${pointer}/verdicts`, [{ verdict: "ATTENTION", count: 1 }], moved);
  moved = changed("/engines/0/fingerprint", "another", moved);
  assert.deepEqual(baselineProblems(moved), []);
  const records = checkBaseline(committed, moved, R5_POLICY);
  const record = records.find((each) => each.run === committed.runs[at].name && each.a === pair.a && each.b === pair.b);
  assert.equal(record?.outcome, "MOVED");
  assert.equal(record?.moved.length, 2);
  assert.match(record?.moved[0] ?? "", /^verdicts were 1 RECORDED, are 1 ATTENTION$/);
  assert.match(record?.moved[1] ?? "", new RegExp(`^${metric.name.replace(".", "\\.")} was .* \\(band `));
  assert.ok(record !== undefined && /MOVED$/.test(stateText(record)));
  assert.equal(checkFails(records), false);
  const [summary] = summarizeChanges(records);
  assert.deepEqual(
    { ...summary, largest: undefined },
    {
      rung: "r5",
      a: pair.a,
      b: pair.b,
      name: metric.name,
      records: 1,
      of: summary.of,
      largest: undefined,
      run: committed.runs[at].name,
    },
  );
  assert.equal(summary.largest, Math.abs(much - (metric.value as number)));
  assert.ok(summary.of >= 1);

  // A recorded pair that is an error today fails the check, as any pair does.
  let errored = changed(`${pointer}/verdict`, "ERROR", committed);
  errored = changed(`${pointer}/verdicts`, [{ verdict: "ERROR", count: 1 }], errored);
  assert.equal(checkFails(checkBaseline(committed, errored, R5_POLICY)), true);
});

test("a metric is counted in the requests that measured it, not in the requests of the rung", async (t) => {
  // R6a judges a figure only in the fields its sampling can arbitrate: a flagged field is a PASS without it, so
  // the count of judged fields is the metric's `measured`, never the number of PASS requests.
  const { manifest, comparisons } = await r5Cycle(tempDir(t));
  const first = comparisons.comparisons.find((set) => set.mode === "pairwise" && set.pairs[0]?.metrics.length > 1);
  assert.ok(first, "the fixture has a pair with more than one metric");
  const [dropped, kept] = first.pairs[0].metrics.map((metric) => metric.name);
  const requests = ["a", "b", "c"].map((mark, index) => ({
    ...first,
    requestId: `${first.requestId.slice(0, -1)}${mark}`,
    pairs: first.pairs.map((pair, at) =>
      at === 0 && index === 2 ? { ...pair, metrics: pair.metrics.filter((metric) => metric.name !== dropped) } : pair,
    ),
  }));
  assert.equal(new Set(requests.map((set) => set.requestId)).size, 3);
  const others = comparisons.comparisons.filter((set) => set.run !== first.run);
  const baseline = buildBaseline(
    manifest,
    { ...comparisons, comparisons: [...requests, ...others] },
    R5_POLICY,
    MTF_BASELINE,
  );
  assert.deepEqual(parseBaseline(baselineText(baseline)), { baseline });
  const rung = baseline.runs.find((run) => run.name === first.run)?.rungs[0];
  assert.equal(rung?.requests, 3);
  const [a, b] = [first.pairs[0].a, first.pairs[0].b].sort();
  const pair = rung?.pairs.find((each) => each.a === a && each.b === b);
  const measured = (name: string): number | undefined => pair?.metrics.find((metric) => metric.name === name)?.measured;
  assert.equal(measured(dropped), 2);
  assert.equal(measured(kept), 3);
  // The report adds the counts up over the runs, beside the requests of the rung.
  const report = buildMtfBaselineReport(baseline);
  const worst = report.rungs[0].pairs.find((each) => each.a === a && each.b === b);
  const total = (name: string): number | undefined => worst?.metrics.find((metric) => metric.name === name)?.measured;
  assert.equal((total(kept) as number) - (total(dropped) as number), 1);
  assert.ok((total(kept) as number) <= report.rungs[0].requests);
});
