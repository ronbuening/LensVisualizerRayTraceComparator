// The committed baselines against the real engines: `lvrtc baseline check` of the benchmark and of the feature
// suite, on the LensVisualizer and the optiland of this repository's configuration. Needs both; each test skips
// with the reason when one is missing. Run output goes to a temporary directory: nothing is written into the
// repository, into LensVisualizer or into optiland.
//
// The baselines were written at LensVisualizer c05a2ab7 (engine closure 78215d72, 151 files) and optiland 4e893f53
// (source hash 279af5c5). A record is held to OK only while its case and its two engines are the ones the baseline
// names: LensVisualizer's lens files change by the day, and a record of an edited lens is STALE(case), which is
// reported and is no failure of this test. What the stale records come to is said in the diagnostics.
import assert from "node:assert/strict";
import { test } from "node:test";

import { REPO_ROOT } from "../../../src/core/config.ts";
import { LV_UNAVAILABLE } from "../lv/support.ts";
import { OPTILAND_UNAVAILABLE, lvrtc, tempDir } from "./support.ts";

const skip = OPTILAND_UNAVAILABLE || LV_UNAVAILABLE;

interface Checked {
  readonly records: readonly {
    readonly run: string;
    readonly rung: string;
    readonly a: string;
    readonly b: string;
    readonly stale: readonly string[];
    readonly outcome: string;
    readonly verdict?: string;
    readonly moved: readonly string[];
  }[];
  readonly counts: Readonly<Record<string, number>>;
  readonly stale: Readonly<Record<string, number>>;
  readonly errors: readonly string[];
}

for (const [suite, records] of [
  // 12 configurations in four conditions, on two sets of lines: five rungs, R0 to R4, and three pairs of engines
  // each. R4 is held here on every run of both suites: its requests are those of R2 and R3, so the check traces
  // nothing more for it.
  ["benchmark", 96 * 5 * 3],
  ["features", 18 * 5 * 3],
] as const) {
  test(
    `baseline check ${suite}: every record of the cases and engines at hand is OK`,
    { skip, timeout: 900_000 },
    (t) => {
      const ended = lvrtc(tempDir(t), REPO_ROOT, ["baseline", "check", suite, "--json"]);
      assert.ok(ended.code === 0 || ended.code === 1, ended.err);
      const said: Checked = JSON.parse(ended.out);
      assert.deepEqual(said.errors, []);
      assert.equal(said.records.length - said.counts.NEW, records);
      t.diagnostic(`${suite}: ${JSON.stringify(said.counts)}; stale ${JSON.stringify(said.stale)}`);
      const current = said.records.filter((record) => record.stale.length === 0 && record.outcome !== "NEW");
      for (const record of current) {
        const at = `${record.run} ${record.rung} ${record.a} ${record.b}`;
        assert.equal(record.outcome, "OK", `${at}: ${record.moved.join("; ")}`);
        assert.ok(record.verdict === "PASS" || record.verdict === "FLOOR", `${at}: ${record.verdict}`);
      }
      // With nothing stale the check is the whole baseline, and the command exits 0.
      if (current.length === said.records.length) assert.equal(ended.code, 0, ended.out);
      for (const record of said.records.filter((each) => each.outcome === "DRIFT")) {
        t.diagnostic(
          `${record.run} ${record.rung} ${record.a} ${record.b}: stale by ${record.stale.join(", ")}, DRIFT: ${record.moved.join("; ")}`,
        );
      }
    },
  );
}
