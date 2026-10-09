// Rung R4f from end to end, without LensVisualizer: `lvrtc run`, `compare` and `report` on a copy of the fake LV
// tree, each in a child process. One lens of the fake samples its geometric MTF as LensVisualizer does, grid by
// grid; the others answer with a closed form that is no sampling at all. The replay agrees with the first and not
// with the second, which is what the rung is for: a product MTF that is not the sampling the comparator replays is
// a FAIL. The fake's numbers describe no real lens.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { cpSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test, type TestContext } from "node:test";
import { fileURLToPath } from "node:url";

import { EXIT_FAILURE, EXIT_OK } from "../../src/cli/main.ts";
import { COMPARISONS_FILE } from "../../src/compare/comparisonFile.ts";
import type { ComparisonFile } from "../../src/compare/comparisonFile.ts";
import { CONTRACT_VERSION } from "../../src/contract/version.ts";
import { CONFIG_FILE, REPO_ROOT } from "../../src/core/config.ts";
import { MANIFEST_FILE } from "../../src/core/manifest.ts";
import type { RunManifest } from "../../src/core/manifest.ts";
import { adapterRevision } from "../../src/engines/adapterRevision.ts";
import { LV_REPLAY_ENGINE_MODULE } from "../../src/engines/lv/replayEngine.ts";
import { REPORT_MARKDOWN_FILE } from "../../src/report/index.ts";
import { tempDir } from "../core/support.ts";
import { FAKE_LENS_FILES, FAKE_LV } from "../engines/lv/support.ts";

const BIN = fileURLToPath(new URL("../../bin/lvrtc.mjs", import.meta.url));
const [SINGLET_FILE] = FAKE_LENS_FILES.map(([file]) => file);

/** A root whose `lvPath` is a copy of the fake LV tree in which the singlet's geometric MTF is sampled. */
function sampledRoot(t: TestContext): string {
  const rootDir = join(tempDir(t), "root");
  mkdirSync(rootDir, { recursive: true });
  writeFileSync(join(rootDir, CONFIG_FILE), JSON.stringify({ lvPath: "lv" }));
  cpSync(FAKE_LV, join(rootDir, "lv"), { recursive: true });
  const singlet = join(rootDir, "lv", ...SINGLET_FILE.split("/"));
  const text = readFileSync(singlet, "utf8");
  writeFileSync(singlet, text.replace("focusTravel: 5,", "focusTravel: 5,\n  mtf: { sampled: true },"));
  assert.notEqual(readFileSync(singlet, "utf8"), text);
  return rootDir;
}

function lvrtc(rootDir: string, ...args: string[]): { code: number | null; out: string; err: string } {
  const env = { ...process.env, LVRTC_RUNS_DIR: join(rootDir, "runs"), LVRTC_LV_PATH: "" };
  const child = spawnSync(process.execPath, [BIN, ...args, "--root", rootDir], {
    encoding: "utf8",
    cwd: REPO_ROOT,
    env,
  });
  return { code: child.status, out: child.stdout, err: child.stderr };
}

test("lvrtc run --rungs r4f: the replay of a sampled MTF passes, and a product that is no sampling fails", (t) => {
  const rootDir = sampledRoot(t);
  const singlet = { kind: "lv", key: "acme-singlet-50" };
  const suite = join(rootDir, "suite.json");
  const runs = [
    { name: "sampled", lens: singlet },
    {
      name: "sampled-f8-best-photopic",
      lens: singlet,
      aperture: { kind: "lv-f8-comparison" },
      lines: { kind: "photopic" },
      imagePlane: { kind: "lv-best-axial" },
      frequenciesPerMm: [40, 10, 20],
    },
    { name: "closed-form", lens: { kind: "lv", key: "acme-zoom-24-48" }, state: { zoomT: 0 } },
  ];
  // The suite names an engine that is none of the rung's: the rung is asked of its own two all the same.
  const defaults = { engines: ["ref"], rungs: ["r4f"] };
  writeFileSync(suite, JSON.stringify({ contract: CONTRACT_VERSION, kind: "suite", name: "fidelity", defaults, runs }));

  const ran = lvrtc(rootDir, "run", suite);
  assert.equal(ran.code, EXIT_OK, ran.err);
  assert.match(ran.out, /^fidelity: 6 jobs: 6 ok, 0 unsupported, 0 error, 0 pending \(6 computed, 0 cached\)$/m);
  const manifest: RunManifest = JSON.parse(readFileSync(join(rootDir, "runs", "fidelity", MANIFEST_FILE), "utf8"));
  assert.deepEqual(
    manifest.jobs.map((job) => `${job.run} ${job.rung} ${job.quantity} ${job.engine} ${job.status}`),
    runs.flatMap(({ name }) => ["lv", "replay"].map((engine) => `${name} r4f mtf.native ${engine} ok`)),
  );
  // The two engines are one LensVisualizer, with an adapter revision each.
  const [lv, replay] = manifest.engines;
  assert.deepEqual([lv.id, replay.id, manifest.engines.length], ["lv", "replay", 2]);
  assert.ok(lv.status === "available" && replay.status === "available");
  assert.equal(replay.fingerprint, lv.fingerprint);
  assert.equal(replay.adapterRevision, adapterRevision(LV_REPLAY_ENGINE_MODULE).revision);
  // The recipe of each run is recorded with it: the plane, the stop, the fields and the frequencies of its request.
  const [first, second] = manifest.runs.map((run) => run.recipe?.recipe);
  assert.deepEqual([first?.source, first?.plane.kind, first?.stopSemiDiameter], ["lv", "design", 6.25]);
  // The fake singlet is f/2 with an iris of 6.25 mm, and its best focus a 128th of the stop radius in front.
  const stop = ((6.25 * 2) / 2) * (2 / 8);
  assert.deepEqual([second?.plane.kind, second?.stopSemiDiameter, second?.lines.length], ["lv-best-axial", stop, 5]);
  assert.equal(second?.plane.lvBestAxialShiftMm, -stop / 128);
  assert.deepEqual(second?.frequenciesPerMm, [10, 20, 40]);
  assert.deepEqual(
    second?.fields.map((field) => [field.fraction, field.angleDeg]),
    [
      [0, 0],
      [0.5, 10],
      [1, 20],
    ],
  );

  const compared = lvrtc(rootDir, "compare", "fidelity");
  assert.equal(compared.code, EXIT_FAILURE, compared.out);
  assert.match(
    compared.out,
    /^fidelity: 6 pairs: 4 PASS, 0 FLOOR, 2 FAIL, 0 RECORDED, 0 ATTENTION, 0 UNSUPPORTED, 0 BLOCKED, 0 ERROR$/m,
  );
  const file: ComparisonFile = JSON.parse(readFileSync(join(rootDir, "runs", "fidelity", COMPARISONS_FILE), "utf8"));
  const pairwise = file.comparisons.filter((set) => set.mode === "pairwise");
  assert.deepEqual(
    pairwise.map((set) => [set.run, set.pairs.map((pair) => `${pair.a} ${pair.b} ${pair.verdict}`)]),
    [
      ["sampled", ["lv replay PASS"]],
      ["sampled-f8-best-photopic", ["lv replay PASS"]],
      ["closed-form", ["lv replay FAIL"]],
    ],
  );
  for (const set of pairwise.slice(0, 2)) {
    const metrics = Object.fromEntries(set.pairs[0].metrics.map((metric) => [metric.name, metric.value]));
    // The fake sums plainly and the estimator compensates: a few roundings, and every count the same.
    assert.ok((metrics["mtf.maxAbs"] as number) < 1e-13, set.run);
    assert.deepEqual([metrics["sampling.mismatches"], metrics["fields.mismatches"]], [0, 0], set.run);
    // What each answer states of its sampling is recorded, a value a field, and is the same in both.
    const [ofLv, ofReplay] = set.participants.map((participant) => participant.recorded);
    assert.equal(ofLv?.gridSize.length, 3);
    assert.deepEqual(ofReplay, ofLv);
  }
  // The closed form is no sampling: its curves, its counts and what it says of a field's convergence are not the
  // replay's, and the reason names each.
  const failed = pairwise[2].pairs[0];
  assert.match(failed.reason ?? "", /^fields\.mismatches \d+ exceeds its tolerance 0; /);
  assert.match(
    failed.reason ?? "",
    /; mtf\.maxAbs \S+ exceeds its tolerance 1\.00e-9 at cut \w+, field \S+, frequencyPerMm \d+; /,
  );
  assert.match(failed.reason ?? "", /; sampling\.mismatches \d+ exceeds its tolerance 0$/);

  const reported = lvrtc(rootDir, "report", "fidelity");
  assert.equal(reported.code, EXIT_OK, reported.err);
  const markdown = readFileSync(join(rootDir, "runs", "fidelity", REPORT_MARKDOWN_FILE), "utf8");
  assert.match(markdown, /^#### r4f\n\nQuantity `mtf\.native`, compared direct, gated\./m);
  assert.match(
    markdown,
    /^\| Engine \| fields\.mismatches \(≤ 0 elements\) \| mtf\.maxAbs \(≤ 1\.00e-9\) \| sampling\.mismatches \(≤ 0 elements\) \| Verdict \| Note \|$/m,
  );
  assert.match(markdown, /^\| gridSize\[0\] \| \d+ \| \d+ \|$/m);
});

test("a baseline may hold R4f: written from a run with it, it checks clean, and no rung is asked of the replay but its own", (t) => {
  const rootDir = sampledRoot(t);
  const lens = { kind: "lv", key: "acme-singlet-50" };
  const runs = [
    { name: "sampled", lens },
    { name: "sampled-best", lens, imagePlane: { kind: "lv-best-axial" } },
  ];
  const suite = join(rootDir, "suite.json");
  const defaults = { engines: ["lv", "ref"], rungs: ["r0", "r1", "r4f"] };
  writeFileSync(suite, JSON.stringify({ contract: CONTRACT_VERSION, kind: "suite", name: "held", defaults, runs }));

  const ran = lvrtc(rootDir, "run", suite);
  assert.equal(ran.code, EXIT_OK, ran.err);
  // R0 and R1 on the two engines the suite names, R4f on its own two: twelve jobs, and none unsupported.
  assert.match(ran.out, /^held: 12 jobs: 12 ok, 0 unsupported, 0 error, 0 pending \(12 computed, 0 cached\)$/m);
  const compared = lvrtc(rootDir, "compare", "held");
  assert.equal(compared.code, EXIT_OK, compared.out);
  assert.match(compared.out, /^held: 12 pairs: 12 PASS, 0 FLOOR, 0 FAIL, .* 0 UNSUPPORTED, 0 BLOCKED, 0 ERROR$/m);

  const written = lvrtc(rootDir, "baseline", "write", "held");
  assert.equal(written.code, EXIT_OK, written.err);
  const baseline = JSON.parse(readFileSync(join(rootDir, "baselines", "held.json"), "utf8"));
  assert.deepEqual(
    baseline.engines.map((engine: { id: string }) => engine.id),
    ["lv", "ref", "replay"],
  );
  for (const run of baseline.runs) {
    assert.deepEqual(
      run.rungs.map((rung: { rung: string; pairs: { a: string; b: string; verdict: string }[] }) => [
        rung.rung,
        rung.pairs.map((pair) => `${pair.a} ${pair.b} ${pair.verdict}`),
      ]),
      [
        ["r0", ["lv ref PASS"]],
        ["r1", ["lv ref PASS"]],
        ["r4f", ["lv replay PASS"]],
      ],
      run.name,
    );
  }
  // The report rendered from it has the rung's section, with its three judged figures.
  const report = readFileSync(join(rootDir, "reports", "held", "rays.md"), "utf8");
  assert.match(report, /^## r4f$/m);
  assert.match(report, /^Quantity `mtf\.native`\./m);
  assert.match(report, /mtf\.maxAbs \(≤ 1\.00e-9\)/);

  // Checked against the engines again: the same six records, each OK. The baseline names the replay, and the check
  // names it for no rung of the run's engines: nothing is new, and nothing unsupported.
  const checked = lvrtc(rootDir, "baseline", "check", suite, "--json");
  assert.equal(checked.code, EXIT_OK, checked.err + checked.out);
  const said: { records: { rung: string; a: string; b: string; outcome: string }[]; errors: string[] } = JSON.parse(
    checked.out,
  );
  assert.deepEqual(said.errors, []);
  assert.deepEqual(
    said.records.map((record) => `${record.rung} ${record.a} ${record.b} ${record.outcome}`),
    ["sampled", "sampled-best"].flatMap(() => ["r0 lv ref OK", "r1 lv ref OK", "r4f lv replay OK"]),
  );
  const verified = lvrtc(rootDir, "verify");
  assert.equal(verified.code, EXIT_OK, verified.err + verified.out);
});
