// Zoom lenses at both ends, against the real LensVisualizer: every zoom of the catalog at its wide and at its tele
// end, the rungs of the ladder at the tele end, and the commands that run both ends where no position is stated.
// Run output goes to a temporary directory.
//
// The numbers quoted in comments were measured at LV commit ed78cf40 (engine closure 1827eefe) with the catalog of
// that commit; none of them is asserted to the digit.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test, type TestContext } from "node:test";
import { fileURLToPath } from "node:url";

import { compareGroup } from "../../../src/compare/group.ts";
import { COMPARATORS } from "../../../src/compare/index.ts";
import { loadPolicy } from "../../../src/compare/policyFile.ts";
import type { OpticalCase } from "../../../src/contract/case.ts";
import type { PairComparison } from "../../../src/contract/comparison.ts";
import type { JsonObject } from "../../../src/contract/json.ts";
import type { QuantityRequest } from "../../../src/contract/request.ts";
import type { RunOptions, RunSpec } from "../../../src/contract/runSpec.ts";
import { CONTRACT_VERSION } from "../../../src/contract/version.ts";
import { REPO_ROOT } from "../../../src/core/config.ts";
import { MANIFEST_FILE } from "../../../src/core/manifest.ts";
import type { RunManifest } from "../../../src/core/manifest.ts";
import { MTF_RUN_FILE } from "../../../src/core/mtfRun.ts";
import { r0Rung, r1Rung, r2Rung } from "../../../src/core/rungs.ts";
import { loadSuite } from "../../../src/core/suite.ts";
import { loadLvBinding } from "../../../src/engines/lv/binding.ts";
import { createLvCaseSource, createLvExporter } from "../../../src/engines/lv/caseSource.ts";
import { createLvEngineOn } from "../../../src/engines/lv/engine.ts";
import { EXPORT_PROBLEM_CODES, LV_GATE_PROBLEM_CODES } from "../../../src/engines/lv/exportProblems.ts";
import { ZOOM_ENDS } from "../../../src/engines/lv/zoomEnds.ts";
import { createRefEngine } from "../../../src/engines/ref/engine.ts";
import { RemoteEngineAdapter } from "../../../src/engines/remote.ts";
import { createInProcessTransport } from "../../../src/transports/inProcess.ts";
import { suitePath } from "../../suites/support.ts";
import { LV_PATH, LV_UNAVAILABLE } from "./support.ts";

const skip = LV_UNAVAILABLE;
const BIN = fileURLToPath(new URL("../../../bin/lvrtc.mjs", import.meta.url));
const POLICY = loadPolicy();
const KNOWN_CODES: readonly string[] = [...EXPORT_PROBLEM_CODES, ...LV_GATE_PROBLEM_CODES];

function tempDir(t: TestContext): string {
  const directory = mkdtempSync(join(tmpdir(), "lvrtc-lv-zoom-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  return directory;
}

/** Runs one `lvrtc` command as a child process, on the real LensVisualizer, writing runs into `runsDir`. */
function lvrtc(runsDir: string, ...args: string[]): { code: number | null; out: string; err: string } {
  const env = { ...process.env, LVRTC_RUNS_DIR: runsDir, LVRTC_LV_PATH: LV_PATH ?? "" };
  const child = spawnSync(process.execPath, [BIN, ...args], {
    encoding: "utf8",
    cwd: REPO_ROOT,
    env,
    maxBuffer: 64 * 1024 * 1024,
  });
  return { code: child.status, out: child.stdout, err: child.stderr };
}

/** `lv` on the real LensVisualizer and `ref`, each behind an adapter, in this process, and the exporter. */
async function engines(t: TestContext) {
  const binding = await loadLvBinding(LV_PATH);
  const lv = new RemoteEngineAdapter({ id: "lv", transport: createInProcessTransport(createLvEngineOn(binding)) });
  const ref = new RemoteEngineAdapter({ id: "ref", transport: createInProcessTransport(createRefEngine()) });
  t.after(() => Promise.all([lv.close(), ref.close()]));
  return { binding, exporter: createLvExporter(binding), lv, ref };
}

type Engines = Awaited<ReturnType<typeof engines>>;

/** A run of one lens, for a rung's request builder. */
function runOf(key: string, options: RunOptions): RunSpec {
  return { contract: CONTRACT_VERSION, kind: "run-spec", name: key, lens: { kind: "lv", key }, ...options };
}

/** The pair of `lv` and `ref` on one request of a rung, judged by the rung's policy as `lvrtc compare` judges it. */
async function judged(
  ask: Engines,
  rung: "r0" | "r1" | "r2" | "r3",
  request: QuantityRequest,
  opticalCase: OpticalCase,
  at: string,
): Promise<PairComparison> {
  const [mine, theirs] = [await ask.lv.run(request, opticalCase), await ask.ref.run(request, opticalCase)];
  for (const result of [mine, theirs]) {
    assert.equal(result.status, "ok", `${at} ${rung}: ${JSON.stringify(result.error ?? result.unsupported)}`);
  }
  return judgedAnswers(rung, request, opticalCase, mine.data as JsonObject, theirs.data as JsonObject, at);
}

function judgedAnswers(
  rung: "r0" | "r1" | "r2" | "r3",
  request: QuantityRequest,
  opticalCase: OpticalCase,
  lvData: JsonObject,
  refData: JsonObject,
  at: string,
): PairComparison {
  const { quantity } = POLICY.rungs[rung];
  return compareGroup(
    {
      suite: "zoom-ends",
      run: at,
      caseId: opticalCase.id,
      rung,
      quantity,
      requestId: request.id,
      participants: [
        { engine: "lv", fingerprint: null, status: "ok", data: lvData },
        { engine: "ref", fingerprint: null, status: "ok", data: refData },
      ],
      policy: POLICY.rungs[rung],
      comparator: COMPARATORS.get(quantity, rung),
      context: { spec: request.spec, opticalCase },
    },
    "pairwise",
  ).pairs[0];
}

function metricOf(pair: PairComparison, name: string): number {
  const metric = pair.metrics.find((each) => each.name === name);
  assert.ok(metric !== undefined && metric.value !== null, name);
  return metric.value;
}

// ── Every zoom of the catalog ────────────────────────────────────────────────────────────────────────────────────

test(
  "every zoom of the catalog exports at both ends or says why not, and lv and ref pass R0 and R1 at the tele end",
  { skip, timeout: 600_000 },
  async (t) => {
    const ask = await engines(t);
    const { binding, exporter } = ask;
    const { entries } = await binding.catalog();

    const threw: string[] = [];
    const notExportable: Record<string, Map<string, string[]>> = { wide: new Map(), tele: new Map() };
    const counts = { zooms: 0, wide: 0, tele: 0 };
    const worst = {
      sag: 0,
      sagAt: "",
      firstOrder: 0,
      firstOrderAt: "",
      pupil: 0,
      pupilAt: "",
      radius: 0,
      radiusAt: "",
    };
    const failed: string[] = [];
    let judgedCases = 0;
    for (const entry of entries) {
      const { key } = entry;
      // The catalog's flag is LensVisualizer's own answer: what `buildLens` calls a zoom.
      const runtime = binding.api.buildLens((await binding.lens(key)).data);
      assert.equal(entry.zoom === true, runtime.isZoom, `${key}: the catalog's zoom flag`);
      if (entry.zoom !== true) continue;
      counts.zooms++;
      for (const { end, zoomT } of ZOOM_ENDS) {
        for (const lines of [{ kind: "reference" }, { kind: "photopic" }] as const) {
          const at = `${key} ${end} ${lines.kind}`;
          let exported: Awaited<ReturnType<typeof exporter.exportLens>>;
          try {
            exported = await exporter.exportLens(key, { state: { zoomT }, lines });
          } catch (error) {
            threw.push(`${at}: ${error instanceof Error ? error.message : String(error)}`);
            continue;
          }
          if (!exported.ok) {
            for (const code of new Set(exported.problems.map((problem) => problem.code))) {
              assert.ok(KNOWN_CODES.includes(code), `${at}: ${code}`);
              if (lines.kind === "reference") {
                notExportable[end].set(code, [...(notExportable[end].get(code) ?? []), key]);
              }
            }
            continue;
          }
          const { opticalCase } = exported;
          assert.deepEqual([opticalCase.label.zoomT, opticalCase.provenance.source.kind], [zoomT, "lv-lens"], at);
          if (lines.kind === "reference") counts[end]++;
          if (end !== "tele") continue;

          // R0 and R1 at the tele end, as a run of the ladder asks and judges them. Nothing is stored.
          judgedCases++;
          const spec = runOf(key, { state: { zoomT }, lines });
          for (const rung of [r0Rung, r1Rung]) {
            const id = rung.id as "r0" | "r1";
            const [request] = rung.buildRequests(opticalCase, spec);
            const pair = await judged(ask, id, request, opticalCase, at);
            if (pair.verdict !== "PASS") failed.push(`${at} ${id}: ${pair.verdict} ${pair.reason ?? ""}`);
            if (id === "r0") {
              const sag = metricOf(pair, "sag.maxScaled");
              if (sag > worst.sag) Object.assign(worst, { sag, sagAt: at });
            } else {
              const [plain, pupil] = [metricOf(pair, "firstOrder.maxAbs"), metricOf(pair, "pupilZ.maxScaled")];
              const radius = metricOf(pair, "pupilRadius.maxScaled");
              if (plain > worst.firstOrder) Object.assign(worst, { firstOrder: plain, firstOrderAt: at });
              if (pupil > worst.pupil) Object.assign(worst, { pupil, pupilAt: at });
              if (radius > worst.radius) Object.assign(worst, { radius, radiusAt: at });
            }
          }
        }
      }
    }
    const reasons = (end: "wide" | "tele"): string =>
      [...notExportable[end]]
        .sort(([a], [b]) => (a < b ? -1 : 1))
        .map(([code, keys]) => `${code} ${keys.length}`)
        .join(", ") || "none";
    const oneEnd = (end: "wide" | "tele", other: "wide" | "tele"): string[] =>
      [...notExportable[end]].flatMap(([code, keys]) =>
        keys.filter((key) => !(notExportable[other].get(code) ?? []).includes(key)).map((key) => `${key} ${code}`),
      );
    t.diagnostic(
      `${counts.zooms} zooms: ${counts.wide} export at the wide end and ${counts.tele} at the tele end on the ` +
        `reference line; not exportable at the wide end: ${reasons("wide")}; at the tele end: ${reasons("tele")}; ` +
        `at the wide end only: ${oneEnd("wide", "tele").join(", ") || "none"}; at the tele end only: ` +
        `${oneEnd("tele", "wide").join(", ") || "none"}`,
    );
    t.diagnostic(
      `tele end, ${judgedCases} cases on the reference and photopic lines: worst R0 sag.maxScaled ${worst.sag} ` +
        `(${worst.sagAt}); worst R1 firstOrder.maxAbs ${worst.firstOrder} mm (${worst.firstOrderAt}); worst R1 ` +
        `pupilZ.maxScaled ${worst.pupil} (${worst.pupilAt}); worst R1 pupilRadius.maxScaled ${worst.radius} ` +
        `(${worst.radiusAt}); not PASS: ${failed.join("; ") || "none"}`,
    );
    assert.deepEqual(threw, [], "exporting a zoom at an end threw");
    assert.ok(counts.zooms > 250, `about 297 zooms, found ${counts.zooms}`);
    // Nearly every zoom has a case at each end, and every case of the tele end was judged on both rungs: an
    // exporter that refused the tele end with a code would leave nothing to fail.
    for (const end of ["wide", "tele"] as const) {
      assert.ok(counts[end] > 250, `about 296 zooms export at the ${end} end, found ${counts[end]}`);
    }
    assert.ok(judgedCases >= counts.tele, `${judgedCases} cases judged for ${counts.tele} tele ends`);
    assert.deepEqual(failed, []);
  },
);

// ── Traced rays at the tele end ──────────────────────────────────────────────────────────────────────────────────

/**
 * Zooms for the ray rungs at the tele end, two of each way a zoom keeps its aperture: one f-number over the range
 * (the iris opens with the focal length), an f-number that rises with an iris that changes, and an iris of one
 * radius whose f-number rises with the focal length.
 */
const TELE_ZOOMS: readonly (readonly [key: string, kind: "constant-aperture" | "variable-aperture" | "fixed-iris"])[] =
  [
    ["minolta-af-35-70-f4", "constant-aperture"],
    ["nikkor-z-14-30f4s", "constant-aperture"],
    ["canon-rfs-18-45mm-f45-63-is-stm", "variable-aperture"],
    ["nikon-af-zoom-nikkor-28-80mm-f33-56g", "variable-aperture"],
    ["nikon-1-nikkor-vr-10-30mm-f35-56-pd-zoom", "fixed-iris"],
    ["tamron-a061-28-300-f35-63", "fixed-iris"],
  ];

test(
  "at the tele end of a constant-aperture, a variable-aperture and a fixed-iris zoom, lv and ref pass R2 and R3 or are FLOOR",
  { skip, timeout: 600_000 },
  async (t) => {
    const ask = await engines(t);
    const { api } = ask.binding;
    const seen: string[] = [];
    for (const [key, kind] of TELE_ZOOMS) {
      // The lens is the kind of zoom it is here for, by LensVisualizer's own functions.
      const runtime = api.buildLens((await ask.binding.lens(key)).data);
      const [stopWide, stopTele] = [api.wideOpenStopAtZoom(0, runtime), api.wideOpenStopAtZoom(1, runtime)];
      const [fWide, fTele] = [api.fopenAtZoom2(0, runtime), api.fopenAtZoom2(1, runtime)];
      const is = fWide === fTele ? "constant-aperture" : stopWide === stopTele ? "fixed-iris" : "variable-aperture";
      assert.equal(is, kind, `${key}: f/${fWide} to f/${fTele}, stop ${stopWide} mm to ${stopTele} mm`);
      if (kind !== "fixed-iris") assert.notEqual(stopWide, stopTele, key);

      const options: RunOptions = { state: { zoomT: 1 }, lines: { kind: "photopic" } };
      const exported = await ask.exporter.exportLens(key, options);
      assert.ok(exported.ok, key);
      const { opticalCase } = exported;
      assert.equal(opticalCase.conditions.stopSemiDiameter, stopTele, key);
      const { sets, problems } = await ask.exporter.raySets(opticalCase, options);
      assert.deepEqual(problems, [], key);
      // Three fields at five lines.
      assert.equal(sets.length, 15, key);

      const verdicts: Record<string, number> = {};
      const worst = { hits: 0, direction: 0, landing: 0, path: 0, rays: 0 };
      for (const request of r2Rung.buildRequests(opticalCase, runOf(key, options), { raySets: sets })) {
        const at = `${key} tele`;
        const [mine, theirs] = [await ask.lv.run(request, opticalCase), await ask.ref.run(request, opticalCase)];
        assert.deepEqual([mine.status, theirs.status], ["ok", "ok"], at);
        const [lvData, refData] = [mine.data as JsonObject, theirs.data as JsonObject];
        const r2 = judgedAnswers("r2", request, opticalCase, lvData, refData, at);
        const r3 = judgedAnswers("r3", request, opticalCase, lvData, refData, at);
        for (const [rung, pair] of [
          ["r2", r2],
          ["r3", r3],
        ] as const) {
          assert.ok(
            pair.verdict === "PASS" || pair.verdict === "FLOOR",
            `${at} ${rung}: ${pair.verdict} ${pair.reason}`,
          );
          verdicts[`${rung} ${pair.verdict}`] = (verdicts[`${rung} ${pair.verdict}`] ?? 0) + 1;
        }
        // Not one ray that one engine stopped and the other passed.
        assert.equal(metricOf(r2, "mask.mismatches"), 0, at);
        worst.rays += metricOf(r2, "rays.compared");
        worst.hits = Math.max(worst.hits, metricOf(r2, "hits.maxDistance"));
        worst.direction = Math.max(worst.direction, metricOf(r2, "direction.maxAbs"));
        worst.landing = Math.max(worst.landing, metricOf(r2, "landing.maxDistance"));
        worst.path = Math.max(worst.path, metricOf(r3, "opticalPathToImage.maxAbs"));
      }
      assert.ok(worst.rays > 1000, `${key}: ${worst.rays} rays`);
      seen.push(
        `${key} (${kind}, f/${fWide} to f/${fTele}): ${JSON.stringify(verdicts)}, ${worst.rays} rays, hits ` +
          `${worst.hits} mm, direction ${worst.direction}, landing ${worst.landing} mm, path to image ${worst.path} waves`,
      );
    }
    t.diagnostic(seen.join("; "));
  },
);

// ── The commands ─────────────────────────────────────────────────────────────────────────────────────────────────

test(
  "lvrtc run suites/features.json, as it is: exit 0, with both ends of its fixed-iris zoom as runs of their own",
  { skip, timeout: 600_000 },
  async (t) => {
    const runsDir = tempDir(t);
    const ran = lvrtc(runsDir, "run", suitePath("features"));
    assert.equal(ran.code, 0, ran.err);
    assert.equal(ran.err, "");
    // 18 runs on two engines: neither answers the conformance quantity, and every other job is answered. The 162
    // ray sets are traced once by each engine, for R2, and R3 and R4 find them in the store. R4f is asked of lv and
    // of the replay of its sampling, one request each for a run. R6a finds the 162 sets in the store and has each
    // engine trace the same fields on the finer lattice, 162 sets more; R6b is asked of lv and of the wave
    // estimator on its rays, one request each for a run.
    assert.match(
      ran.out,
      /^features: 1800 jobs: 1764 ok, 36 unsupported, 0 error, 0 pending \(792 computed, 972 cached\)$/m,
    );
    const manifest: RunManifest = JSON.parse(readFileSync(join(runsDir, "features", MANIFEST_FILE), "utf8"));
    assert.equal(manifest.runs.length, 18);
    const zoom = manifest.runs.filter((run) => run.name.startsWith("fixed-iris-zoom"));
    assert.deepEqual(
      zoom.map((run) => run.name),
      ["ref-wide", "ref-tele", "photopic-wide", "photopic-tele"].map((rest) => `fixed-iris-zoom-${rest}`),
    );
    assert.equal(new Set(zoom.map((run) => run.caseId)).size, 4);
    for (const run of manifest.runs) assert.deepEqual(run.problems, [], run.name);
    // Each end has its own rays: three fields at one line, three at five.
    assert.deepEqual(
      zoom.map((run) => run.raySets?.sets.length),
      [3, 3, 15, 15],
    );
    const setsAt = (end: string): string[] =>
      zoom.filter((run) => run.name.endsWith(end)).flatMap((run) => run.raySets?.sets ?? []);
    assert.deepEqual(
      setsAt("-wide").filter((set) => setsAt("-tele").includes(set)),
      [],
      "the two ends share no set of rays",
    );

    // The manifest's runs are the suite's as the case source states them, and its hash is the file's as written.
    const suite = await loadSuite(suitePath("features"), {
      rootDir: REPO_ROOT,
      sources: { lv: createLvCaseSource(LV_PATH) },
    });
    assert.deepEqual(
      manifest.runs.map((run) => [run.name, run.caseId]),
      suite.runs.map((run) => [run.spec.name, run.opticalCase?.id]),
    );
    assert.equal(manifest.suite.hash, suite.hash);
    for (const [name, zoomT] of [
      ["fixed-iris-zoom-ref-wide", 0],
      ["fixed-iris-zoom-ref-tele", 1],
    ] as const) {
      assert.equal(suite.runs.find((run) => run.spec.name === name)?.opticalCase?.label.zoomT, zoomT, name);
    }

    const compared = lvrtc(runsDir, "compare", "features");
    assert.equal(compared.code, 0, compared.out);
    // R6a adds a pair for each of the 54 fields, and R6b one for each run, recorded: each counted in both modes.
    const summary =
      /^features: 1044 pairs: \d+ PASS, \d+ FLOOR, 0 FAIL, (\d+) RECORDED, (\d+) ATTENTION, 36 UNSUPPORTED, 0 BLOCKED, 0 ERROR$/m.exec(
        compared.out,
      );
    assert.ok(
      summary !== null,
      compared.out.split("\n").find((line) => line.startsWith("features: ")),
    );
    assert.equal(Number(summary[1]) + Number(summary[2]), 36);
    for (const end of ["wide", "tele"]) {
      for (const rung of ["r0", "r1", "r2", "r3", "r4", "r6a"]) {
        assert.match(
          compared.out,
          new RegExp(`^fixed-iris-zoom-photopic-${end} +${rung} +pairwise +lv +ref +PASS`, "m"),
        );
      }
    }
  },
);

test(
  "lvrtc mtf nikon-z-24-70f4s: two tables, wide and tele, and the tele one is the one of --zoom 1, bit for bit",
  { skip, timeout: 600_000 },
  (t) => {
    // Two runs directories, so that neither command finds the other's answers in its store.
    const [bothDir, teleDir] = [tempDir(t), tempDir(t)];
    const both = lvrtc(bothDir, "mtf", "nikon-z-24-70f4s");
    const tele = lvrtc(teleDir, "mtf", "nikon-z-24-70f4s", "--zoom", "1");
    assert.deepEqual([both.code, tele.code], [0, 0], both.err + tele.err);
    assert.deepEqual([both.err, tele.err], ["", ""]);

    const blocks = both.out.split(/(?<=\nresult: [^\n]*\n)\n/);
    assert.equal(blocks.length, 2);
    assert.deepEqual(
      blocks.map((block) => block.split("\n")[2]),
      ["state    zoom 0 (wide), infinity focus", "state    zoom 1 (tele), infinity focus"],
    );
    for (const block of blocks) {
      assert.match(block, /^lv {2}ok {2}computed$/m);
      // Eleven fields at the tab's 10 % steps, each with a number at both shown frequencies in both cuts.
      assert.equal(block.match(/^[0-9.]+ +[0-9.]+ +[0-9.]+ +ok +0\.\d+ +0\.\d+ +0\.\d+ +0\.\d+$/gm)?.length, 11);
    }
    // The two ends are two cases and two tables.
    assert.notEqual(blocks[0].split("\n")[3], blocks[1].split("\n")[3]);
    assert.notEqual(blocks[0].split("\n").slice(6, -2).join("\n"), blocks[1].split("\n").slice(6, -2).join("\n"));

    // The tele end, asked for by itself: the same text, and the same bytes on disk.
    assert.equal(blocks[1].replaceAll(bothDir, "<runs>"), tele.out.replaceAll(teleDir, "<runs>"));
    const directory = (runsDir: string, name: string): string => join(runsDir, "mtf", "lv-tab-default", name);
    assert.deepEqual(readdirSync(join(bothDir, "mtf", "lv-tab-default")).sort(), [
      "nikon-z-24-70f4s",
      "nikon-z-24-70f4s-zoom1",
    ]);
    assert.deepEqual(readdirSync(join(teleDir, "mtf", "lv-tab-default")), ["nikon-z-24-70f4s-zoom1"]);
    const record = (runsDir: string): string =>
      readFileSync(join(directory(runsDir, "nikon-z-24-70f4s-zoom1"), MTF_RUN_FILE), "utf8");
    assert.equal(record(bothDir), record(teleDir));
    const cases = (runsDir: string): string[] =>
      readdirSync(join(directory(runsDir, "nikon-z-24-70f4s-zoom1"), "cases"));
    assert.deepEqual(cases(bothDir), cases(teleDir));
    const [caseFile] = cases(bothDir);
    assert.equal(
      JSON.parse(readFileSync(join(directory(bothDir, "nikon-z-24-70f4s-zoom1"), "cases", caseFile), "utf8")).label
        .zoomT,
      1,
    );

    // The tools of one state say, of a zoom, where the other end is.
    const shown = lvrtc(bothDir, "lenses", "show", "nikon-z-24-70f4s", "--json");
    const hint = "nikon-z-24-70f4s is a zoom lens: this is its wide end (zoom 0); --zoom 1 gives the tele end\n";
    assert.deepEqual([shown.code, shown.err], [0, `lvrtc lenses: ${hint}`]);
    assert.equal(JSON.parse(shown.out).zoomT, 0);
    const exported = lvrtc(bothDir, "export", "nikon-z-24-70f4s");
    assert.deepEqual([exported.code, exported.err], [0, `lvrtc export: ${hint}`]);
    assert.equal(JSON.parse(exported.out).label.zoomT, 0);
    assert.equal(lvrtc(bothDir, "export", "nikon-z-24-70f4s", "--zoom", "1").err, "");
  },
);
