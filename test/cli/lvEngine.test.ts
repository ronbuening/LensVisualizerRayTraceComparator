// The engine `lv` through the commands, against a copy of the fake LV tree: `lvrtc run --engines lv,ref`, then
// `compare` and `report`, each in a child process, so that this process binds no LensVisualizer. The fake has a
// paraxial kernel and conic surfaces of its own, and its numbers describe no real lens.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { copyFileSync, cpSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test, type TestContext } from "node:test";
import { fileURLToPath } from "node:url";

import { EXIT_FAILURE, EXIT_OK } from "../../src/cli/main.ts";
import { COMPARISONS_FILE } from "../../src/compare/comparisonFile.ts";
import type { ComparisonFile } from "../../src/compare/comparisonFile.ts";
import { finalizeCase } from "../../src/contract/case.ts";
import type { OpticalCase } from "../../src/contract/case.ts";
import { CONTRACT_VERSION } from "../../src/contract/version.ts";
import { CONFIG_FILE, REPO_ROOT } from "../../src/core/config.ts";
import { MANIFEST_FILE } from "../../src/core/manifest.ts";
import type { RunManifest } from "../../src/core/manifest.ts";
import { canonicalJson } from "../../src/core/numeric/canonicalJson.ts";
import { decodeNdArray, encodeNdArray } from "../../src/core/numeric/ndarray.ts";
import { adapterRevision } from "../../src/engines/adapterRevision.ts";
import { LV_ENGINE_MODULE } from "../../src/engines/lv/engine.ts";
import { REPORT_MARKDOWN_FILE } from "../../src/report/index.ts";
import { caseFixture, tempDir } from "../core/support.ts";
import { FAKE_ENGINE_FILES, FAKE_LV, closureOf } from "../engines/lv/support.ts";

const BIN = fileURLToPath(new URL("../../bin/lvrtc.mjs", import.meta.url));

/** A root whose `lvPath` is a copy of the fake LV tree beside it and that defines no engine of its own. */
function lvRoot(t: TestContext, lvPath: string | null = "lv"): string {
  const rootDir = join(tempDir(t), "root");
  mkdirSync(join(rootDir, "cases"), { recursive: true });
  writeFileSync(join(rootDir, CONFIG_FILE), JSON.stringify({ lvPath }));
  cpSync(FAKE_LV, join(rootDir, "lv"), { recursive: true });
  return rootDir;
}

/** Runs one `lvrtc` command on a root as a child process, with the runs directory in the root. */
function lvrtc(rootDir: string, ...args: string[]): { code: number | null; out: string; err: string } {
  const env = { ...process.env, LVRTC_RUNS_DIR: join(rootDir, "runs"), LVRTC_LV_PATH: "" };
  const child = spawnSync(process.execPath, [BIN, ...args, "--root", rootDir], {
    encoding: "utf8",
    cwd: REPO_ROOT,
    env,
  });
  return { code: child.status, out: child.stdout, err: child.stderr };
}

function writeSuite(rootDir: string, runs: readonly unknown[]): string {
  const file = join(rootDir, "suite.json");
  writeFileSync(file, JSON.stringify({ contract: CONTRACT_VERSION, kind: "suite", name: "lv-ladder", runs }));
  return file;
}

test("lv and ref run R0 and R1 on LensVisualizer lenses and every pair passes; the report says so twice alike", (t) => {
  const rootDir = lvRoot(t);
  const suite = writeSuite(rootDir, [
    { name: "singlet", lens: { kind: "lv", key: "acme-singlet-50" } },
    {
      name: "zoom-tele-f8-photopic",
      lens: { kind: "lv", key: "acme-zoom-24-48" },
      state: { zoomT: 1 },
      aperture: { kind: "f-number", value: 8 },
      lines: { kind: "photopic" },
    },
    {
      name: "singlet-close",
      lens: { kind: "lv", key: "acme-singlet-50" },
      state: { focus: { kind: "focusT", value: 1 } },
    },
  ]);
  const ran = lvrtc(rootDir, "run", suite, "--engines", "lv,ref", "--rungs", "r0,r1");
  assert.equal(ran.code, EXIT_OK, ran.err);
  assert.match(ran.out, /^lv-ladder: 12 jobs: 12 ok, 0 unsupported, 0 error, 0 pending \(12 computed, 0 cached\)$/m);

  const manifest: RunManifest = JSON.parse(readFileSync(join(rootDir, "runs", "lv-ladder", MANIFEST_FILE), "utf8"));
  const closure = closureOf(join(rootDir, "lv"), FAKE_ENGINE_FILES);
  // The engine and the case source are the same LensVisualizer: one closure, stated by each.
  assert.deepEqual(manifest.engines[0], {
    id: "lv",
    status: "available",
    version: "1",
    fingerprint: closure,
    adapterRevision: adapterRevision(LV_ENGINE_MODULE).revision,
    details: { commit: null, dirty: null, engineFileCount: FAKE_ENGINE_FILES.length },
  });
  assert.equal(manifest.sources?.lv.fingerprint.engineClosureHash, closure);
  assert.equal(manifest.sources?.lv.status, "unchanged");

  const compared = lvrtc(rootDir, "compare", "lv-ladder");
  assert.equal(compared.code, EXIT_OK, compared.err);
  assert.match(
    compared.out,
    /^lv-ladder: 12 pairs: 12 PASS, 0 FLOOR, 0 FAIL, 0 RECORDED, 0 ATTENTION, 0 UNSUPPORTED, 0 BLOCKED, 0 ERROR$/m,
  );
  const reported = lvrtc(rootDir, "report", "lv-ladder");
  assert.equal(reported.code, EXIT_OK, reported.err);
  const report = readFileSync(join(rootDir, "runs", "lv-ladder", REPORT_MARKDOWN_FILE), "utf8");
  // LensVisualizer's stored constants are listed beside the comparison, under names that say what they are.
  assert.match(report, /^\| lvStoredEntrancePupilZ\[0\] \| [^|]+ \| — \|$/m);
  assert.match(report, /^\| magnification\[0\] \| -[^|]+ \| -[^|]+ \|$/m);

  // A second run finds every answer in the store, and the same report comes of it, byte for byte.
  const again = lvrtc(rootDir, "run", suite, "--engines", "lv,ref", "--rungs", "r0,r1");
  assert.match(again.out, /\(0 computed, 12 cached\)$/m);
  assert.equal(lvrtc(rootDir, "compare", "lv-ladder").code, EXIT_OK);
  assert.equal(lvrtc(rootDir, "report", "lv-ladder").code, EXIT_OK);
  assert.equal(readFileSync(join(rootDir, "runs", "lv-ladder", REPORT_MARKDOWN_FILE), "utf8"), report);
});

test("lv refuses a fixture by its source and a corrupted case as stale-case; ref answers both", (t) => {
  const rootDir = lvRoot(t);
  copyFileSync(caseFixture("singlet"), join(rootDir, "cases", "contract-singlet.json"));

  // A case exported from the checkout, then one index nudged and the case finished again: it is what it says it
  // is, and it is not what LensVisualizer gives.
  const exportedFile = join(rootDir, "cases", "exported.json");
  const exported = lvrtc(rootDir, "export", "acme-singlet-50", "--out", exportedFile);
  assert.equal(exported.code, EXIT_OK, exported.err);
  const opticalCase: OpticalCase = JSON.parse(readFileSync(exportedFile, "utf8"));
  const table = decodeNdArray(opticalCase.conditions.indexAfterSurface);
  assert.ok(table.dtype === "f8" && table.values[0] === 1.5);
  table.values[0] = 1.5000001;
  const nudged = finalizeCase({
    label: opticalCase.label,
    system: opticalCase.system,
    conditions: { ...opticalCase.conditions, indexAfterSurface: encodeNdArray(table.values, table.shape) },
    provenance: opticalCase.provenance,
  });
  assert.equal(nudged.systemId, opticalCase.systemId);
  assert.notEqual(nudged.id, opticalCase.id);
  writeFileSync(join(rootDir, "cases", "nudged.json"), `${canonicalJson(nudged)}\n`);

  const suite = writeSuite(rootDir, [
    { name: "exported", lens: { kind: "fixture", path: "cases/exported.json" } },
    { name: "fixture", lens: { kind: "fixture", path: "cases/contract-singlet.json" } },
    { name: "nudged", lens: { kind: "fixture", path: "cases/nudged.json" } },
  ]);
  const ran = lvrtc(rootDir, "run", suite, "--engines", "lv,ref", "--rungs", "r0,r1");
  assert.equal(ran.code, EXIT_FAILURE, "a stale case is an error");
  assert.match(ran.out, /^lv-ladder: 12 jobs: 8 ok, 2 unsupported, 2 error, 0 pending \(12 computed, 0 cached\)$/m);
  // A stored case of a LensVisualizer lens is answered like one built in this run: its source is in its provenance.
  assert.match(ran.out, /^exported +r0 +lv +ok +computed$/m);
  assert.match(ran.out, /^fixture +r0 +lv +unsupported +computed +the engine lv answers from LensVisualizer's own/m);
  assert.match(
    ran.out,
    /^nudged +r1 +lv +error +computed +stale-case: the case of lens acme-singlet-50 is stale: its conditions are not/m,
  );
  assert.match(ran.out, /^nudged +r1 +ref +ok +computed$/m);

  const manifest: RunManifest = JSON.parse(readFileSync(join(rootDir, "runs", "lv-ladder", MANIFEST_FILE), "utf8"));
  const lvJobs = manifest.jobs.filter((job) => job.engine === "lv" && job.rung === "r0");
  assert.deepEqual(
    lvJobs.map((job) => [job.run, job.status, job.unsupported ?? job.error ?? null]),
    [
      ["exported", "ok", null],
      ["fixture", "unsupported", [{ code: "case-source", item: "fixture" }]],
      ["nudged", "error", { code: "stale-case" }],
    ],
  );

  const compared = lvrtc(rootDir, "compare", "lv-ladder");
  assert.equal(compared.code, EXIT_FAILURE);
  const file: ComparisonFile = JSON.parse(readFileSync(join(rootDir, "runs", "lv-ladder", COMPARISONS_FILE), "utf8"));
  const verdicts = file.comparisons
    .filter((set) => set.mode === "pairwise")
    .map((set) => [set.run, set.rung, set.pairs[0].verdict, set.pairs[0].reason ?? null]);
  assert.deepEqual(verdicts, [
    ["exported", "r0", "PASS", null],
    ["exported", "r1", "PASS", null],
    ["fixture", "r0", "UNSUPPORTED", "lv is unsupported (case-source fixture)"],
    ["fixture", "r1", "UNSUPPORTED", "lv is unsupported (case-source fixture)"],
    ["nudged", "r0", "ERROR", "lv ended as error (stale-case)"],
    ["nudged", "r1", "ERROR", "lv ended as error (stale-case)"],
  ]);
});

test("without a LensVisualizer, lv is unavailable with its code and ref runs as ever", (t) => {
  const rootDir = lvRoot(t, null);
  copyFileSync(caseFixture("singlet"), join(rootDir, "cases", "contract-singlet.json"));
  const suite = writeSuite(rootDir, [
    { name: "fixture", lens: { kind: "fixture", path: "cases/contract-singlet.json" } },
  ]);
  const ran = lvrtc(rootDir, "run", suite, "--engines", "lv,ref", "--rungs", "r0");
  assert.equal(ran.code, EXIT_FAILURE);
  assert.match(
    ran.out,
    /^fixture +r0 +lv +error +unavailable +not-configured: engine lv is unavailable \(not-configured\): /m,
  );
  assert.match(ran.out, /^fixture +r0 +ref +ok +computed$/m);
  const manifest: RunManifest = JSON.parse(readFileSync(join(rootDir, "runs", "lv-ladder", MANIFEST_FILE), "utf8"));
  assert.deepEqual(manifest.engines[0], { id: "lv", status: "unavailable", code: "not-configured" });

  const conformance = lvrtc(rootDir, "engine", "conformance", "lv");
  assert.equal(conformance.code, EXIT_FAILURE);
  assert.match(conformance.out, /^FAIL +hello +engine lv is unavailable \(not-configured\): /m);
});

/** The suite of the ray rungs: a singlet on its three default fields, and a zoom on five lines with a lost field. */
function raySuite(rootDir: string): string {
  return writeSuite(rootDir, [
    { name: "singlet", lens: { kind: "lv", key: "acme-singlet-50" }, sampling: { bundleGrid: 4 } },
    {
      name: "zoom-photopic",
      lens: { kind: "lv", key: "acme-zoom-24-48" },
      // One state: a zoom without a position would be two runs, one for each end.
      state: { zoomT: 0 },
      lines: { kind: "photopic" },
      fields: { kind: "angles-deg", values: [0, 75] },
      sampling: { bundleGrid: 4 },
    },
  ]);
}

/** Every pair of a compared run as `run rung: verdict`, each once, with the reason of one that is not PASS. */
function verdictsOf(rootDir: string): string[] {
  const file: ComparisonFile = JSON.parse(readFileSync(join(rootDir, "runs", "lv-ladder", COMPARISONS_FILE), "utf8"));
  const said = file.comparisons
    .filter((set) => set.mode === "pairwise")
    .map((set) => `${set.run} ${set.rung}: ${set.pairs[0].verdict}`);
  return [...new Set(said)];
}

test("lvrtc run --rungs r2,r3: lv and ref trace LensVisualizer's own launch rays, and every pair passes", (t) => {
  const rootDir = lvRoot(t);
  const suite = raySuite(rootDir);
  const ran = lvrtc(rootDir, "run", suite, "--engines", "lv,ref", "--rungs", "r2,r3");
  assert.equal(ran.code, EXIT_OK, ran.err);
  // Three fields of the singlet on its one line; of the zoom, the axis at each of its five lines: the fake finds
  // no chief ray at 75 degrees. Each engine traces each set once, for r2, and r3 finds the answers in the store.
  assert.match(ran.out, /^lv-ladder: 32 jobs: 32 ok, 0 unsupported, 0 error, 0 pending \(16 computed, 16 cached\)$/m);
  assert.match(ran.out, /^singlet +r2 +lv +ok +computed$/m);
  assert.match(ran.out, /^singlet +r2 +ref +ok +computed$/m);
  assert.match(ran.out, /^zoom-photopic +r3 +ref +ok +cached$/m);
  assert.equal(
    ran.err,
    "lvrtc run: run zoom-photopic: a field has no rays: chief-ray-failed: LensVisualizer finds no chief ray for " +
      "the field at 75 degrees\n",
  );

  const manifest: RunManifest = JSON.parse(readFileSync(join(rootDir, "runs", "lv-ladder", MANIFEST_FILE), "utf8"));
  assert.deepEqual(
    manifest.runs.map((run) => [run.name, run.raySets?.sets.length, run.raySets?.problems.length]),
    [
      ["singlet", 3, 0],
      ["zoom-photopic", 5, 1],
    ],
  );
  assert.equal(new Set(manifest.jobs.map((job) => job.requestId)).size, 8);
  for (const job of manifest.jobs.filter((each) => each.engine === "lv")) {
    assert.deepEqual([job.quantity, job.status], ["rays.trace", "ok"]);
    const entry = JSON.parse(readFileSync(join(rootDir, "runs", "store", `${job.storeKey}.json`), "utf8"));
    // 6 columns by 5 rows and the chief ray, through 3 surfaces of the singlet or the 7 of the zoom.
    assert.equal(entry.result.diagnostics.counts.rays, 31);
    assert.equal(entry.request.spec.groups.chiefIndex, 30);
    assert.deepEqual(entry.result.data.hits.$nd.shape, [job.run === "singlet" ? 3 : 7, 31, 3]);
    assert.equal(entry.result.engine.adapterRevision, adapterRevision(LV_ENGINE_MODULE).revision);
  }

  // A second process generates the same rays: every request has the id it had, and its answer is in the store.
  const text = readFileSync(join(rootDir, "runs", "lv-ladder", MANIFEST_FILE), "utf8");
  const again = lvrtc(rootDir, "run", suite, "--engines", "lv,ref", "--rungs", "r2,r3");
  assert.match(again.out, /\(0 computed, 32 cached\)$/m);
  assert.equal(readFileSync(join(rootDir, "runs", "lv-ladder", MANIFEST_FILE), "utf8"), text);

  // The fake's tracer stops within 1e-13 mm of a surface, and the reference engine on it: every pair passes, in
  // both rungs and both modes, and no ray is in the rim band or in doubt.
  const compared = lvrtc(rootDir, "compare", "lv-ladder");
  assert.equal(compared.code, EXIT_OK, compared.err + compared.out);
  assert.match(
    compared.out,
    /^lv-ladder: 32 pairs: 32 PASS, 0 FLOOR, 0 FAIL, 0 RECORDED, 0 ATTENTION, 0 UNSUPPORTED, 0 BLOCKED, 0 ERROR$/m,
  );
  const file: ComparisonFile = JSON.parse(readFileSync(join(rootDir, "runs", "lv-ladder", COMPARISONS_FILE), "utf8"));
  const limits: Record<string, number> = {
    "hits.maxDistance": 1e-11,
    "direction.maxAbs": 1e-12,
    "landing.maxDistance": 1e-11,
    "mask.mismatches": 0,
    "mask.rimBand": 0,
    "opticalPath.maxAbs": 1e-7,
    "opticalPathToImage.maxAbs": 1e-7,
    "opd.maxAbs": 1e-7,
  };
  let compared16 = 0;
  for (const set of file.comparisons) {
    const [pair] = set.pairs;
    assert.deepEqual([pair.a, pair.b, pair.verdict], ["lv", "ref", "PASS"], `${set.run} ${set.rung}`);
    for (const metric of pair.metrics) {
      if (metric.name === "rays.compared") {
        compared16 += metric.value ?? 0;
        continue;
      }
      assert.ok((metric.value ?? NaN) <= limits[metric.name], `${set.run} ${metric.name} ${metric.value}`);
      // A metric of traced rays says where it occurs in its run: the line, the field, the ray.
      if (metric.where !== undefined) assert.equal(typeof metric.where.line, "number", metric.name);
    }
    // Each engine's rays are counted, ok and blocked and failed, beside the pair of rung r2.
    const recorded = set.participants.map((participant) => Object.keys(participant.recorded ?? {}));
    const counts = set.rung === "r2" ? ["rays.blocked", "rays.failed", "rays.ok"] : [];
    assert.deepEqual(recorded, [counts, counts], `${set.run} ${set.rung}`);
  }
  assert.ok(compared16 > 100, `rays that are ok in both engines: ${compared16}`);

  // The report has a section for each set, with the floor limits in the headings of the metrics that have one.
  const reported = lvrtc(rootDir, "report", "lv-ladder", "--floor", join(rootDir, "digest"));
  assert.equal(reported.code, EXIT_OK, reported.err);
  const report = readFileSync(join(rootDir, "runs", "lv-ladder", REPORT_MARKDOWN_FILE), "utf8");
  assert.match(report, /^#### r2, request 3 of 3$/m);
  assert.match(report, /\| direction\.maxAbs \(≤ 1\.00e-9; floor ≤ 1\.00e-8\) \|/);
  assert.match(report, /\| hits\.maxDistance \(≤ 1\.00e-8 mm; floor ≤ 1\.00e-7\) \|/);
  // The mask is judged at 0 and has no floor.
  assert.match(report, /\| mask\.mismatches \(≤ 0 rays\) \|/);
  assert.match(report, /\| opd\.maxAbs \(≤ 2\.00e-5 waves; floor ≤ 2\.00e-4\) \|/);
  assert.match(report, /^\| rays\.ok\[0\] \| \d+ \| \d+ \|$/m);
  // The engines table states the adapter revision of each of the comparator's own engines.
  assert.match(report, /^\| Engine \| Status \| Version \| Fingerprint \| Adapter revision \|$/m);

  // The digest of the run: numbers, names and hashes, the same bytes each time it is written.
  const digest = readFileSync(join(rootDir, "digest", "lv-floor.md"), "utf8");
  assert.match(reported.out, /^floor: .*lv-floor\.md$/m);
  assert.match(digest, /^# Numerical floor of lv against ref: lv-ladder$/m);
  assert.match(digest, /^Quantity `rays\.trace`: 8 pairs, 8 PASS\.$/m);
  assert.match(digest, /^\| zoom-photopic \| 5 \| 5 PASS \| /m);
  const model = JSON.parse(readFileSync(join(rootDir, "digest", "lv-floor.json"), "utf8"));
  assert.deepEqual([model.kind, model.engine.id, model.arbiter.id], ["floor-report", "lv", "ref"]);
  assert.equal(model.engine.fingerprint, closureOf(join(rootDir, "lv"), FAKE_ENGINE_FILES));
  for (const text of [digest, JSON.stringify(model)]) assert.ok(!text.includes(rootDir) && !text.includes("$nd"));
  assert.equal(lvrtc(rootDir, "report", "lv-ladder", "--floor", join(rootDir, "digest")).code, EXIT_OK);
  assert.equal(readFileSync(join(rootDir, "digest", "lv-floor.md"), "utf8"), digest);
});

/** Makes the tracer of a root's LensVisualizer meet every surface `offset` mm behind where the surface is. */
function displaceHits(rootDir: string, offset: string): void {
  const file = join(rootDir, "lv", "src", "optics", "trace", "sequentialTrace.ts");
  const text = readFileSync(file, "utf8");
  const edited = text.replace(
    "- surface.z - surface.profile.sag(radius);",
    `- surface.z - surface.profile.sag(radius) - ${offset};`,
  );
  assert.notEqual(edited, text, "the fake tracer's residual was to be edited");
  writeFileSync(file, edited);
}

test("a LensVisualizer whose hits are 3e-8 mm off is the floor of lv: FLOOR, a pass that is counted apart", (t) => {
  const rootDir = lvRoot(t);
  // Three times the gate of a hit, and well inside the 1e-7 mm a floor may be.
  displaceHits(rootDir, "3e-8");
  const ran = lvrtc(rootDir, "run", raySuite(rootDir), "--engines", "lv,ref", "--rungs", "r0,r1,r2,r3");
  assert.equal(ran.code, EXIT_OK, ran.err);
  const compared = lvrtc(rootDir, "compare", "lv-ladder");
  // A floor fails nothing: the command exits 0, and says how many pairs are FLOOR beside how many are PASS.
  assert.equal(compared.code, EXIT_OK, compared.out);
  const counts = /^lv-ladder: (\d+) pairs: (\d+) PASS, (\d+) FLOOR, 0 FAIL, .* 0 BLOCKED, 0 ERROR$/m.exec(compared.out);
  assert.ok(counts !== null, compared.out);
  const [pairs, pass, floor] = counts.slice(1).map(Number);
  assert.equal(pairs, 2 * (2 + 2 + 8 + 8));
  assert.equal(pass + floor, pairs);
  // The system and its first-order data are what they were; every set of rays is 3e-8 mm off in its hits.
  const verdicts = verdictsOf(rootDir);
  assert.deepEqual(
    verdicts.filter((said) => / r[01]: /.test(said)),
    ["singlet r0: PASS", "singlet r1: PASS", "zoom-photopic r0: PASS", "zoom-photopic r1: PASS"],
  );
  assert.deepEqual(
    verdicts.filter((said) => / r2: /.test(said)),
    ["singlet r2: FLOOR", "zoom-photopic r2: FLOOR"],
  );
  assert.ok(floor >= 16, compared.out);

  const file: ComparisonFile = JSON.parse(readFileSync(join(rootDir, "runs", "lv-ladder", COMPARISONS_FILE), "utf8"));
  const [pair] = file.comparisons.find((set) => set.rung === "r2" && set.mode === "reference-vs-each")?.pairs ?? [];
  const hits = pair.metrics.find((metric) => metric.name === "hits.maxDistance")?.value ?? 0;
  assert.ok(hits > 2.5e-8 && hits < 6e-8, String(hits));
  // The reason names what exceeded its gate, and the figures against the arbiter that make it a floor.
  assert.match(
    pair.reason ?? "",
    /^hits\.maxDistance \d\.\d\de-8 exceeds its tolerance 1\.00e-8 at .*; floor of lv: lv against ref direction\.maxAbs \d\.\d\de-\d+ within 1\.00e-8, lv against ref hits\.maxDistance \d\.\d\de-8 within 1\.00e-7, lv against ref landing\.maxDistance \d\.\d\de-\d+ within 1\.00e-7$/,
  );

  const reported = lvrtc(rootDir, "report", "lv-ladder", "--floor", join(rootDir, "digest"));
  assert.equal(reported.code, EXIT_OK, reported.err);
  const report = readFileSync(join(rootDir, "runs", "lv-ladder", REPORT_MARKDOWN_FILE), "utf8");
  assert.match(report, /^No pair is FAIL or ERROR, of 40 compared\.$/m);
  assert.match(report, new RegExp(`^\\| FLOOR \\| ${floor / 2} \\| ${floor / 2} \\|$`, "m"));
  // The reference is lv, the first engine by id that answered: the row is ref's, and the floor is still lv's.
  assert.match(report, /^\| ref \| [^|]+ \| [^|]+ \| [^|]+ \| 0 \| 0 \| \d+ \| FLOOR \| hits\.maxDistance /m);
  const digest = readFileSync(join(rootDir, "digest", "lv-floor.md"), "utf8");
  assert.match(digest, /^Quantity `rays\.trace`: 8 pairs, 8 FLOOR\.$/m);
  assert.match(digest, /^\| singlet \| 3 \| 3 FLOOR \| \d\.\d\de-8 \| /m);
});

test("a LensVisualizer whose hits are 3e-6 mm off is beyond any floor: FAIL, and compare exits 1", (t) => {
  const rootDir = lvRoot(t);
  displaceHits(rootDir, "3e-6");
  const ran = lvrtc(rootDir, "run", raySuite(rootDir), "--engines", "lv,ref", "--rungs", "r2,r3");
  assert.equal(ran.code, EXIT_OK, ran.err);
  const compared = lvrtc(rootDir, "compare", "lv-ladder");
  assert.equal(compared.code, EXIT_FAILURE, compared.out);
  assert.deepEqual(
    verdictsOf(rootDir).filter((said) => / r2: /.test(said)),
    ["singlet r2: FAIL", "zoom-photopic r2: FAIL"],
  );
  // The reason says that the floor was considered, and which figure against the arbiter is beyond its limit.
  assert.match(
    compared.out,
    /^singlet +r2 +pairwise +lv +ref +FAIL +.*hits\.maxDistance \d\.\d\de-6 exceeds its tolerance 1\.00e-8 .*; not a floor of lv: hits\.maxDistance against ref \d\.\d\de-6 exceeds the floor limit 1\.00e-7$/m,
  );
});
