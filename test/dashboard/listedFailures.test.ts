// A FAIL that a suite's list of known failures lists (the catalog's, focus-stations'): the dashboard shows each
// classified figure with its class and the entry of docs/gotchas.md that explains it. Synthetic figures only.
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import { baselineText } from "../../src/baseline/build.ts";
import { classifyCatalog, failureEvidence } from "../../src/baseline/catalog.ts";
import type { Baseline } from "../../src/contract/baseline.ts";
import { renderBaselineRun } from "../../src/dashboard/html.ts";
import { createViews } from "../../src/dashboard/server.ts";
import { createSources } from "../../src/dashboard/sources.ts";
import { classLabel } from "../../src/vocabulary/index.ts";
import { tempDir } from "../core/support.ts";
import { visibleText } from "./support.ts";

const GOTCHA = "docs/gotchas.md#artificial-example";

function stations(): Baseline {
  const raw: Baseline = {
    contract: "1.3",
    kind: "baseline",
    suite: { name: "focus-stations", hash: "a".repeat(64) },
    policy: { version: 1, hash: "b".repeat(64) },
    engines: ["lv", "optiland"].map((id) => ({ id, version: "stand-in", fingerprint: "c".repeat(64), details: {} })),
    runs: [
      {
        name: "artificial-zoom0-focus1",
        caseId: "d".repeat(64),
        rungs: [
          {
            rung: "ray-trace",
            quantity: "rays.trace",
            requests: 2,
            support: [
              { engine: "lv", status: "ok" },
              { engine: "optiland", status: "ok" },
            ],
            pairs: [
              {
                a: "lv",
                b: "optiland",
                verdict: "FAIL",
                verdicts: [
                  { verdict: "PASS", count: 1 },
                  { verdict: "FAIL", count: 1 },
                ],
                metrics: [{ name: "mask.mismatches", unit: "rays", value: 2, tolerance: 0 }],
              },
            ],
          },
        ],
      },
    ],
  };
  const rung = raw.runs[0].rungs[0];
  return classifyCatalog(raw, [
    {
      run: raw.runs[0].name,
      rung: rung.rung,
      engines: ["lv", "optiland"],
      metric: "mask.mismatches",
      class: "method",
      gotcha: GOTCHA,
      reproducer: "node bin/lvrtc.mjs run suites/focus-stations-repro/artificial.json --checks ray-trace --jobs 4",
      evidenceHash: failureEvidence(rung.requests, rung.pairs[0]),
    },
  ]);
}

test("a listed FAIL of focus-stations is shown with its class and its gotcha, as the catalog's", (t) => {
  const root = join(tempDir(t), "root");
  const runsDir = join(tempDir(t), "runs");
  mkdirSync(join(root, "baselines"), { recursive: true });
  mkdirSync(runsDir, { recursive: true });
  writeFileSync(join(root, "baselines", "focus-stations.json"), baselineText(stations()));
  const views = createViews(createSources({ rootDir: root, runsDir }), () => ({ state: "not-asked" }));
  const run = views.baselineRun("focus-stations", 0);
  assert.ok(run !== null);
  const pair = run.rungs[0].pairs[0];
  assert.equal(pair.verdict, "FAIL");
  assert.deepEqual(pair.failures, [{ metric: "mask.mismatches", class: "method", gotcha: GOTCHA }]);
  const text = visibleText(renderBaselineRun(run));
  assert.ok(text.includes(classLabel("method")), text);
  assert.ok(text.includes(GOTCHA), text);
});
