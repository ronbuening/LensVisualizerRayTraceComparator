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
    /^lv-ladder: 12 pairs: 12 PASS, 0 FAIL, 0 RECORDED, 0 ATTENTION, 0 UNSUPPORTED, 0 BLOCKED, 0 ERROR$/m,
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

test("lvrtc run --rungs rays: lv traces LensVisualizer's own launch rays, and nothing judges them yet", (t) => {
  const rootDir = lvRoot(t);
  const suite = writeSuite(rootDir, [
    { name: "singlet", lens: { kind: "lv", key: "acme-singlet-50" }, sampling: { bundleGrid: 4 } },
    {
      name: "zoom-photopic",
      lens: { kind: "lv", key: "acme-zoom-24-48" },
      lines: { kind: "photopic" },
      fields: { kind: "angles-deg", values: [0, 75] },
      sampling: { bundleGrid: 4 },
    },
  ]);
  const ran = lvrtc(rootDir, "run", suite, "--engines", "lv,ref", "--rungs", "rays");
  assert.equal(ran.code, EXIT_OK, ran.err);
  // Three fields of the singlet on its one line; of the zoom, the axis at each of its five lines: the fake finds
  // no chief ray at 75 degrees. lv traces each set; ref does not trace rays yet and is not asked.
  assert.match(ran.out, /^lv-ladder: 16 jobs: 8 ok, 8 unsupported, 0 error, 0 pending \(8 computed, 0 cached\)$/m);
  assert.match(ran.out, /^singlet +rays +lv +ok +computed$/m);
  assert.match(ran.out, /^zoom-photopic +rays +ref +unsupported +negotiated +the engine does not offer rays\.trace$/m);
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
    assert.deepEqual([job.rung, job.quantity, job.status], ["rays", "rays.trace", "ok"]);
    const entry = JSON.parse(readFileSync(join(rootDir, "runs", "store", `${job.storeKey}.json`), "utf8"));
    // 6 columns by 5 rows and the chief ray, through 3 surfaces of the singlet or the 7 of the zoom.
    assert.equal(entry.result.diagnostics.counts.rays, 31);
    assert.equal(entry.request.spec.groups.chiefIndex, 30);
    assert.deepEqual(entry.result.data.hits.$nd.shape, [job.run === "singlet" ? 3 : 7, 31, 3]);
    assert.equal(entry.result.engine.adapterRevision, adapterRevision(LV_ENGINE_MODULE).revision);
  }

  // A second process generates the same rays: every request has the id it had, and its answer is in the store.
  const text = readFileSync(join(rootDir, "runs", "lv-ladder", MANIFEST_FILE), "utf8");
  const again = lvrtc(rootDir, "run", suite, "--engines", "lv,ref", "--rungs", "rays");
  assert.match(again.out, /\(0 computed, 8 cached\)$/m);
  assert.equal(readFileSync(join(rootDir, "runs", "lv-ladder", MANIFEST_FILE), "utf8"), text);

  // The rung has no entry in the policy: a run of it cannot be compared, and says so.
  const compared = lvrtc(rootDir, "compare", "lv-ladder");
  assert.equal(compared.code, 2);
  assert.match(compared.err, /^lvrtc compare: the policy has no entry for the rung rays$/m);
});
