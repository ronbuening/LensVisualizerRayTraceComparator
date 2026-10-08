// Rungs R2 and R3 of `lv` against `ref` on the real LensVisualizer: the committed suites through the commands, as a
// user runs them, and the lenses of the catalog on which LensVisualizer does what a comparison must know about.
// `ref` is the arbiter here: its own proof is the analytic tests of test/engines/ref, which need no LensVisualizer.
// Run output goes to a temporary directory.
//
// The numbers quoted in comments, and the pinned ones, were measured at LV commit 3af45e3f with the catalog of that
// commit; its engine files are those of the d36f44b3 working tree the earlier stages name (closure f6681074).
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test, type TestContext } from "node:test";
import { fileURLToPath } from "node:url";
import { isDeepStrictEqual } from "node:util";

import { COMPARISONS_FILE } from "../../../src/compare/comparisonFile.ts";
import type { ComparisonFile } from "../../../src/compare/comparisonFile.ts";
import { compareGroup } from "../../../src/compare/group.ts";
import { COMPARATORS } from "../../../src/compare/index.ts";
import { loadPolicy } from "../../../src/compare/policyFile.ts";
import type { OpticalCase } from "../../../src/contract/case.ts";
import type { PairComparison } from "../../../src/contract/comparison.ts";
import type { JsonObject } from "../../../src/contract/json.ts";
import { RAYS_TRACE, RAY_STATUS } from "../../../src/contract/quantities/raysTrace.ts";
import type { RaysTraceData, RaysTraceSpec } from "../../../src/contract/quantities/raysTrace.ts";
import { makeRequest } from "../../../src/contract/request.ts";
import type { RunOptions } from "../../../src/contract/runSpec.ts";
import { REPO_ROOT } from "../../../src/core/config.ts";
import { MANIFEST_FILE } from "../../../src/core/manifest.ts";
import type { RunManifest } from "../../../src/core/manifest.ts";
import { decodeNdArray } from "../../../src/core/numeric/ndarray.ts";
import { loadLvBinding } from "../../../src/engines/lv/binding.ts";
import type { LvBinding } from "../../../src/engines/lv/binding.ts";
import { rebuildCase } from "../../../src/engines/lv/caseModel.ts";
import { createLvExporter } from "../../../src/engines/lv/caseSource.ts";
import type { LvExporter } from "../../../src/engines/lv/caseSource.ts";
import { createLvEngineOn } from "../../../src/engines/lv/engine.ts";
import { createLensBuilder } from "../../../src/engines/lv/lensBuilder.ts";
import { lvTraceOptions } from "../../../src/engines/lv/rays.ts";
import { createRefEngine } from "../../../src/engines/ref/engine.ts";
import { RemoteEngineAdapter } from "../../../src/engines/remote.ts";
import type { FloorReport } from "../../../src/report/floor.ts";
import { createInProcessTransport } from "../../../src/transports/inProcess.ts";
import { suitePath } from "../../suites/support.ts";
import { LV_PATH, LV_UNAVAILABLE } from "./support.ts";

const skip = LV_UNAVAILABLE;
const BIN = fileURLToPath(new URL("../../../bin/lvrtc.mjs", import.meta.url));
const POLICY = loadPolicy();
/** The digest of the benchmark that is committed: the Phase 1 numerical-floor report. */
const COMMITTED_DIGEST = join(REPO_ROOT, "reports", "benchmark", "lv-floor.json");

function tempDir(t: TestContext): string {
  const directory = mkdtempSync(join(tmpdir(), "lvrtc-lv-rungs-"));
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

/** What a suite came to on the four rungs of the ladder, through `lvrtc run`, `compare` and `report --floor`. */
interface Cycle {
  readonly manifest: RunManifest;
  readonly comparisons: ComparisonFile;
  readonly digest: FloorReport;
  readonly digestText: { readonly json: string; readonly markdown: string };
  /** The summary line of `lvrtc compare`. */
  readonly verdicts: string;
  readonly runsDir: string;
}

function cycle(t: TestContext, suite: "benchmark" | "features"): Cycle {
  const runsDir = tempDir(t);
  const ran = lvrtc(runsDir, "run", suitePath(suite), "--engines", "lv,ref", "--rungs", "r0,r1,r2,r3");
  assert.equal(ran.code, 0, ran.err);
  assert.equal(ran.err, "", "every field of every run has rays");
  const compared = lvrtc(runsDir, "compare", suite);
  // A floor is a pass: the command exits 0 as long as no pair is FAIL or ERROR.
  assert.equal(
    compared.code,
    0,
    compared.out
      .split("\n")
      .filter((line) => / (FAIL|ERROR) /.test(line))
      .join("\n"),
  );
  const reported = lvrtc(runsDir, "report", suite, "--floor", join(runsDir, "digest"));
  assert.equal(reported.code, 0, reported.err);
  const read = (...path: string[]): string => readFileSync(join(runsDir, ...path), "utf8");
  const digestText = { json: read("digest", "lv-floor.json"), markdown: read("digest", "lv-floor.md") };
  // The digest is the same bytes whenever it is written from the same run.
  assert.equal(lvrtc(runsDir, "report", suite, "--floor", join(runsDir, "again")).code, 0);
  assert.equal(read("again", "lv-floor.json"), digestText.json);
  assert.equal(read("again", "lv-floor.md"), digestText.markdown);
  return {
    manifest: JSON.parse(read(suite, MANIFEST_FILE)),
    comparisons: JSON.parse(read(suite, COMPARISONS_FILE)),
    digest: JSON.parse(digestText.json),
    digestText,
    verdicts: compared.out.split("\n").find((line) => line.startsWith(`${suite}: `)) ?? "",
    runsDir,
  };
}

/** The largest value of each metric over the pairs of one rung, with the run and the place it occurs at. */
function worstOf(file: ComparisonFile, rung: string): Record<string, { value: number; at: string }> {
  const worst: Record<string, { value: number; at: string }> = {};
  for (const set of file.comparisons) {
    if (set.rung !== rung) continue;
    for (const pair of set.pairs) {
      for (const metric of pair.metrics) {
        assert.ok(metric.value !== null, `${set.run} ${metric.name} is not finite`);
        if (worst[metric.name] === undefined || metric.value > worst[metric.name].value) {
          worst[metric.name] = { value: metric.value, at: `${set.run} ${JSON.stringify(metric.where ?? {})}` };
        }
      }
    }
  }
  return worst;
}

/** What the pairs of the ray rungs came to, each pair once, and how the rays of each engine ended. */
function tallyOf(file: ComparisonFile) {
  const verdicts: Record<string, number> = {};
  const floors = new Map<string, string>();
  const rays = { compared: 0, rimBand: 0, mismatches: 0, lvOk: 0, lvBlocked: 0, lvFailed: 0, refFailed: 0, refOk: 0 };
  for (const set of file.comparisons) {
    if (set.mode !== "pairwise") continue;
    const [pair] = set.pairs;
    verdicts[`${set.rung} ${pair.verdict}`] = (verdicts[`${set.rung} ${pair.verdict}`] ?? 0) + 1;
    if (pair.verdict === "FLOOR") floors.set(`${set.run} ${set.rung}`, pair.reason ?? "");
    if (set.rung !== "r2") continue;
    const value = (name: string): number => pair.metrics.find((metric) => metric.name === name)?.value ?? 0;
    rays.compared += value("rays.compared");
    rays.rimBand += value("mask.rimBand");
    rays.mismatches += value("mask.mismatches");
    const recorded = (engine: string, name: string): number =>
      set.participants.find((participant) => participant.engine === engine)?.recorded?.[name]?.[0] ?? 0;
    rays.lvOk += recorded("lv", "rays.ok");
    rays.lvBlocked += recorded("lv", "rays.blocked");
    rays.lvFailed += recorded("lv", "rays.failed");
    rays.refOk += recorded("ref", "rays.ok");
    rays.refFailed += recorded("ref", "rays.failed");
  }
  return { verdicts, floors, rays };
}

function said(worst: Record<string, { value: number; at: string }>, names: readonly string[]): string {
  return names.map((name) => `${name} ${worst[name].value} (${worst[name].at})`).join("; ");
}

const R2_METRICS = ["hits.maxDistance", "direction.maxAbs", "landing.maxDistance"] as const;
const R3_METRICS = ["opticalPath.maxAbs", "opticalPathToImage.maxAbs", "opd.maxAbs"] as const;

// ── The benchmark ────────────────────────────────────────────────────────────────────────────────────────────────

test(
  "the benchmark: lv and ref agree on R0 to R3 at the reference and the photopic lines, and the digest is the committed one",
  { skip, timeout: 600_000 },
  (t) => {
    const { manifest, comparisons, digest, digestText, verdicts } = cycle(t, "benchmark");
    // 24 runs; R0 and R1 once each, and 216 ray sets (12 configurations, three fields, one line and five), which
    // each engine traces once for R2 and R3 together.
    assert.equal(manifest.jobs.length, 2 * (24 + 24 + 216 + 216));
    assert.equal(
      manifest.runs.reduce((sets, run) => sets + (run.raySets?.sets.length ?? 0), 0),
      216,
    );
    assert.ok(manifest.jobs.every((job) => job.status === "ok"));

    // Every gated pair is PASS or FLOOR, and nothing else: no failure, no error, nothing blocked.
    assert.match(
      verdicts,
      /^benchmark: 960 pairs: \d+ PASS, \d+ FLOOR, 0 FAIL, 0 RECORDED, 0 ATTENTION, 0 UNSUPPORTED, 0 BLOCKED, 0 ERROR$/,
    );
    const { verdicts: counts, floors, rays } = tallyOf(comparisons);
    const [r2, r3] = [worstOf(comparisons, "r2"), worstOf(comparisons, "r3")];
    t.diagnostic(
      `benchmark: ${verdicts}; ${JSON.stringify(counts)}; R2 ${said(r2, R2_METRICS)}; R3 ${said(r3, R3_METRICS)}; ` +
        `rays ${JSON.stringify(rays)}; floors ${JSON.stringify([...floors.keys()])}`,
    );
    // Not one ray that one engine stopped and the other passed, in the rim band or outside it, and not one ray
    // that either engine could not trace.
    assert.deepEqual(
      [rays.mismatches, rays.rimBand, rays.lvFailed, rays.refFailed],
      [0, 0, 0, 0],
      JSON.stringify(rays),
    );
    assert.equal(rays.lvOk, rays.refOk);
    assert.equal(rays.compared, rays.lvOk);
    assert.ok(rays.compared > 100_000, String(rays.compared));

    // At 3af45e3f every pair of the benchmark passes outright, on 137 596 rays that both engines land (of 235 812
    // launched): the largest hit distance is 6.8e-9 mm, the largest difference of a direction 3.1e-10 and of a
    // landing 9.1e-9 mm, all three on sigma-35mm-f14-dg-hsm-a at 650 nm and 31.9 degrees; the optical path to the
    // last surface differs by at most 6.0e-6 waves (the same lens, 510 nm), to the image by 5.3e-6
    // (sony-fe-20mm-f18-g, 470 nm, 47.5 degrees), and relative to the chief ray by 5.5e-6
    // (nikon-z-24-70f4s at its long end, 470 nm). Everything is LensVisualizer's intersection tolerance of 1e-9 mm,
    // carried through the surfaces behind it.
    assert.deepEqual(counts, { "r0 PASS": 24, "r1 PASS": 24, "r2 PASS": 216, "r3 PASS": 216 });
    assert.equal(floors.size, 0);
    assert.ok(r2["hits.maxDistance"].value > 1e-9 && r2["hits.maxDistance"].value < 1e-8, said(r2, R2_METRICS));
    assert.ok(r2["direction.maxAbs"].value < 1e-9 && r2["landing.maxDistance"].value < 1e-8, said(r2, R2_METRICS));
    for (const name of R3_METRICS) assert.ok(r3[name].value > 1e-7 && r3[name].value < 2e-5, said(r3, R3_METRICS));

    // The digest: who was compared, by hash, and at which commit of LensVisualizer.
    const lv = manifest.engines.find((engine) => engine.id === "lv");
    assert.ok(lv?.status === "available");
    assert.deepEqual([digest.kind, digest.engine.id, digest.arbiter.id], ["floor-report", "lv", "ref"]);
    assert.equal(digest.engine.fingerprint, lv.fingerprint);
    assert.equal(digest.engine.details.commit, lv.details.commit);
    assert.equal(digest.rows.length, 4 * 24);
    assert.deepEqual(
      digest.rungs.map((rung) => [rung.rung, rung.requests]),
      [
        ["r0", 24],
        ["r1", 24],
        ["r2", 216],
        ["r3", 216],
      ],
    );
    // Numbers, keys and hashes: no array of rays, no path of this machine, no time.
    for (const text of [digestText.json, digestText.markdown]) {
      for (const absent of ["$nd", REPO_ROOT, LV_PATH ?? "?", "/Users/", "/home/", "\r"])
        assert.ok(!text.includes(absent), absent);
    }
    assert.ok(digestText.json.length < 200_000, String(digestText.json.length));

    // Every run is named with the content hash of its case: what was traced, whatever LensVisualizer's commit and
    // its dirty flag say of a checkout whose lens files change by the day.
    assert.deepEqual(
      digest.runs,
      manifest.runs.map(({ name, caseId }) => ({ name, caseId })),
    );
    assert.ok(digest.runs.every((run) => /^[0-9a-f]{64}$/.test(run.caseId ?? "")));

    // The committed digest is this one, wherever it was taken, as long as LensVisualizer's engine files and the
    // cases it makes of the benchmark's lenses are the ones it names: the same figures for every run and rung.
    // With other engine files, or a lens that has been edited since, it is a record of what it names.
    assert.ok(existsSync(COMMITTED_DIGEST), "reports/benchmark/lv-floor.json is committed");
    const committed: FloorReport = JSON.parse(readFileSync(COMMITTED_DIGEST, "utf8"));
    assert.deepEqual([committed.kind, committed.suite.name], ["floor-report", "benchmark"]);
    const sameEngine = committed.engine.fingerprint === digest.engine.fingerprint;
    const sameCases = isDeepStrictEqual(committed.runs, digest.runs) && committed.suite.hash === digest.suite.hash;
    if (sameEngine && sameCases) {
      assert.deepEqual(committed.rows, digest.rows, "regenerate reports/benchmark as README.md says");
      assert.deepEqual(committed.rungs, digest.rungs);
    } else {
      const edited = digest.runs.filter((run, at) => committed.runs?.[at]?.caseId !== run.caseId);
      t.diagnostic(
        `the committed digest was taken of LensVisualizer ${committed.engine.fingerprint} ` +
          `(commit ${String(committed.engine.details.commit)}); the one here is ${digest.engine.fingerprint}, and ` +
          `${edited.length} of its ${digest.runs.length} cases are other cases: ` +
          `${edited.map((run) => run.name).join(", ") || "none"}`,
      );
    }
  },
);

// ── The feature suite ────────────────────────────────────────────────────────────────────────────────────────────

test(
  "the feature suite: every pair is PASS or FLOOR on R0 to R3, and the floors are those of one steep field",
  { skip, timeout: 600_000 },
  (t) => {
    const { manifest, comparisons, verdicts } = cycle(t, "features");
    // 16 runs as written, 18 as run: the fixed-iris zoom states no position and is run at both ends.
    assert.equal(manifest.runs.length, 18);
    assert.deepEqual(
      manifest.runs.map((run) => run.name).filter((name) => name.startsWith("fixed-iris-zoom")),
      ["ref-wide", "ref-tele", "photopic-wide", "photopic-tele"].map((rest) => `fixed-iris-zoom-${rest}`),
    );
    assert.ok(manifest.jobs.every((job) => job.status === "ok"));
    assert.match(
      verdicts,
      /^features: 720 pairs: \d+ PASS, \d+ FLOOR, 0 FAIL, 0 RECORDED, 0 ATTENTION, 0 UNSUPPORTED, 0 BLOCKED, 0 ERROR$/,
    );
    const { verdicts: counts, floors, rays } = tallyOf(comparisons);
    const [r2, r3] = [worstOf(comparisons, "r2"), worstOf(comparisons, "r3")];
    t.diagnostic(
      `features: ${verdicts}; ${JSON.stringify(counts)}; R2 ${said(r2, R2_METRICS)}; R3 ${said(r3, R3_METRICS)}; ` +
        `rays ${JSON.stringify(rays)}; floors ${JSON.stringify([...floors])}`,
    );
    assert.deepEqual(
      [rays.mismatches, rays.rimBand, rays.lvFailed, rays.refFailed],
      [0, 0, 0, 0],
      JSON.stringify(rays),
    );
    assert.equal(rays.compared, rays.lvOk);
    assert.ok(rays.compared > 50_000, String(rays.compared));

    // At ed78cf40 four of the 324 pairs of traced rays are FLOOR, all of zeiss-hologon-15f8 at its full field of
    // 55 degrees, at 470 nm and 510 nm: its rays leave the last surface 54 degrees off the axis, so a hit that is
    // 2.2e-9 mm off along the ray lands 1.10e-8 mm from where it should, and its path to the image plane is
    // 2.07e-5 waves off (2.28e-5 relative to the chief ray). Traced in 60-digit arithmetic, the reference engine
    // is 6e-15 mm and 2e-11 waves from the truth on that ray, and LensVisualizer the rest. See docs/gotchas.md.
    assert.deepEqual(counts, {
      "r0 PASS": 18,
      "r1 PASS": 18,
      "r2 PASS": 160,
      "r2 FLOOR": 2,
      "r3 PASS": 160,
      "r3 FLOOR": 2,
    });
    assert.deepEqual([...floors.keys()], ["stop-inside-element-photopic r2", "stop-inside-element-photopic r3"]);
    for (const [where, reason] of floors) {
      // Each names what exceeded its gate, and the figures against the arbiter that make it a floor.
      assert.match(reason, /exceeds its tolerance .*; floor of lv: lv against ref /, where);
      assert.ok(!reason.includes("not a floor"), where);
    }
    assert.match(
      floors.get("stop-inside-element-photopic r2") ?? "",
      /^landing\.maxDistance 1\.\d\de-8 exceeds its tolerance 1\.00e-8 at field 5\.53e1, line \d, ray \d+; floor of lv: lv against ref hits\.maxDistance \d\.\d\de-9 within 1\.00e-7, lv against ref landing\.maxDistance 1\.\d\de-8 within 1\.00e-7$/,
    );
    // The hits themselves are inside their gate on every lens: it is the landing, behind a steep exit, that is not.
    assert.ok(r2["hits.maxDistance"].value < 1e-8, said(r2, R2_METRICS));
    assert.ok(r2["direction.maxAbs"].value < 1e-9, said(r2, R2_METRICS));
    assert.ok(r2["landing.maxDistance"].value > 1e-8 && r2["landing.maxDistance"].value < 2e-8, said(r2, R2_METRICS));
    assert.ok(r3["opticalPath.maxAbs"].value < 2e-5, said(r3, R3_METRICS));
    assert.ok(r3["opticalPathToImage.maxAbs"].value > 2e-5 && r3["opticalPathToImage.maxAbs"].value < 3e-5);
    assert.ok(r3["opd.maxAbs"].value > 2e-5 && r3["opd.maxAbs"].value < 3e-5, said(r3, R3_METRICS));
    for (const name of [...R2_METRICS.slice(0, 1), ...R3_METRICS]) {
      const worst = name === "hits.maxDistance" ? r2[name] : r3[name];
      assert.ok(worst.at.length > 0, name);
    }
  },
);

// ── Lenses of the catalog a comparison must know about ───────────────────────────────────────────────────────────

/** `lv` and `ref` in this process, and what is needed to ask LensVisualizer about a single ray. */
async function engines(t: TestContext) {
  const binding = await loadLvBinding(LV_PATH);
  const lv = new RemoteEngineAdapter({ id: "lv", transport: createInProcessTransport(createLvEngineOn(binding)) });
  const ref = new RemoteEngineAdapter({ id: "ref", transport: createInProcessTransport(createRefEngine()) });
  t.after(() => Promise.all([lv.close(), ref.close()]));
  return { binding, exporter: createLvExporter(binding), lv, ref };
}

/** One ray set of a lens with what `lv` and `ref` answer about it, and the two rungs' pairs. */
interface TracedSet {
  readonly opticalCase: OpticalCase;
  readonly spec: RaysTraceSpec;
  readonly lvData: RaysTraceData;
  readonly refData: RaysTraceData;
  readonly r2: PairComparison;
  readonly r3: PairComparison;
}

async function tracedSets(
  ask: { exporter: LvExporter; lv: RemoteEngineAdapter; ref: RemoteEngineAdapter },
  key: string,
  options: RunOptions = {},
): Promise<TracedSet[]> {
  const exported = await ask.exporter.exportLens(key, options);
  assert.ok(exported.ok, key);
  const { opticalCase } = exported;
  const { sets, problems } = await ask.exporter.raySets(opticalCase, options);
  assert.deepEqual(problems, [], key);
  const traced: TracedSet[] = [];
  for (const spec of sets) {
    const request = makeRequest({ caseId: opticalCase.id, quantity: RAYS_TRACE, spec });
    const [mine, theirs] = [await ask.lv.run(request, opticalCase), await ask.ref.run(request, opticalCase)];
    assert.deepEqual([mine.status, theirs.status], ["ok", "ok"], key);
    const participants = [
      { engine: "lv", fingerprint: null, status: "ok" as const, data: mine.data as JsonObject },
      { engine: "ref", fingerprint: null, status: "ok" as const, data: theirs.data as JsonObject },
    ];
    const pairOf = (rung: "r2" | "r3"): PairComparison =>
      compareGroup(
        {
          suite: "catalog",
          run: key,
          caseId: opticalCase.id,
          rung,
          quantity: RAYS_TRACE,
          requestId: request.id,
          participants,
          policy: POLICY.rungs[rung],
          comparator: COMPARATORS.get(RAYS_TRACE, rung),
          context: { spec, opticalCase },
        },
        "pairwise",
      ).pairs[0];
    traced.push({
      opticalCase,
      spec,
      lvData: mine.data as RaysTraceData,
      refData: theirs.data as RaysTraceData,
      r2: pairOf("r2"),
      r3: pairOf("r3"),
    });
  }
  return traced;
}

function metricOf(pair: PairComparison, name: string) {
  const metric = pair.metrics.find((each) => each.name === name);
  assert.ok(metric !== undefined, name);
  return metric;
}

/** LensVisualizer's own account of one ray of a set: how its trace ended, and what its classification makes of it. */
async function lensVisualizerSays(binding: LvBinding, opticalCase: OpticalCase, spec: RaysTraceSpec, ray: number) {
  const rebuilt = await rebuildCase(binding, createLensBuilder(binding), opticalCase);
  assert.ok(rebuilt.ok);
  const { model } = rebuilt;
  const origins = decodeNdArray(spec.origins).values;
  const directions = decodeNdArray(spec.directions).values;
  const trace = binding.api.traceEngineRay2(
    model.state,
    {
      origin: [origins[3 * ray], origins[3 * ray + 1], origins[3 * ray + 2]],
      direction: [directions[3 * ray], directions[3 * ray + 1], directions[3 * ray + 2]],
    },
    lvTraceOptions(model, spec.line),
  );
  const classified = binding.api.mtfTraceClassification(trace, model.state, opticalCase.conditions.stopSemiDiameter);
  return { status: trace.status, failureReason: trace.failureReason, classified };
}

/**
 * The zooms whose stop comes to lie behind the surface before it at the tele end only: the gap in front of the
 * stop closes there, or the iris opens past the circle in which the curve before it meets the stop's plane. Found
 * at LV ed78cf40 by tracing the tele end of every zoom of the catalog, outside the tests.
 */
const TELE_ONLY_CROSSINGS: readonly (readonly [key: string, surface: number, zoomT: 1])[] = [
  ["nikon-ai-s-zoom-nikkor-35-70mm-f35", 15, 1],
  ["nikon-ai-zoom-nikkor-25-50mm-f4", 8, 1],
];

/**
 * The lenses in which a surface lies behind the one before it within both clear apertures, with the surface at
 * which LensVisualizer loses rays: a stop or a flat face set into the curve of its neighbour. A zoom is named with
 * the end it does so at: at its default state, the wide end, where none is named.
 */
const CROSSING_SURFACES: readonly (readonly [key: string, surface: number, zoomT?: 1])[] = [
  ["bertele-sonnar-50f2-scaled", 6],
  ["leica-elmarit-90f28", 5],
  ["nokton-50f1", 7],
  ["olympus-zuiko-auto-s-50f14", 6],
  ["pentax-da-18-55mm-f35-56-al", 15],
  ["vivitar-series-1-70-210-f35", 21],
  ["vivitar-series-1-70-210-f35", 21, 1],
  ...TELE_ONLY_CROSSINGS,
];

test(
  "where two surfaces cross inside their clear apertures LensVisualizer loses the ray, and R2 says so as a mask mismatch",
  { skip, timeout: 600_000 },
  async (t) => {
    const ask = await engines(t);
    const seen: string[] = [];
    for (const [key, surface, zoomT] of CROSSING_SURFACES) {
      const sets = await tracedSets(ask, key, zoomT === undefined ? {} : { state: { zoomT } });
      const mismatches = sets.map((set) => metricOf(set.r2, "mask.mismatches").value ?? 0);
      seen.push(
        `${key}${zoomT === undefined ? "" : " at the tele end"} surface ${surface}: ${mismatches.join(", ")} rays`,
      );
      assert.ok(Math.max(...mismatches) > 0, key);
      const { opticalCase, spec, lvData, refData, r2 } = sets[mismatches.findIndex((count) => count > 0)];
      // A mismatch, not a rim: the pair fails, and the reason names the surface. No floor excuses a mask.
      assert.equal(r2.verdict, "FAIL", key);
      const first = metricOf(r2, "mask.mismatches");
      assert.equal(first.where?.surface, surface, key);
      assert.equal(metricOf(r2, "mask.rimBand").value, 0, key);
      assert.match(
        r2.reason ?? "",
        /mask\.mismatches \d+ exceeds its tolerance 0 at .*; not a floor of lv: mask\.mismatches has no floor$/,
      );

      // Whose ray is it? LensVisualizer stopped it at that surface; the reference engine has it there, behind its
      // hit on the surface before: a step backwards along a ray that travels forwards.
      const ray = Number(first.where?.ray);
      const rays = lvData.status.$nd.shape[0];
      assert.equal(decodeNdArray(lvData.status).values[ray], RAY_STATUS.blocked, key);
      assert.equal(decodeNdArray(lvData.endSurface).values[ray], surface, key);
      const refEnd = decodeNdArray(refData.endSurface).values[ray];
      assert.ok(refEnd === -1 || refEnd > surface, `${key}: ref ends at ${refEnd}`);
      const hits = decodeNdArray(refData.hits).values;
      const z = (at: number): number => hits[(at * rays + ray) * 3 + 2];
      assert.ok(z(surface) < z(surface - 1), `${key}: z ${z(surface - 1)} then ${z(surface)}`);
      // And the ray does travel forwards: the surface after is met further on.
      if (surface + 1 < opticalCase.system.surfaces.length && (refEnd === -1 || refEnd > surface + 1)) {
        assert.ok(z(surface + 1) > z(surface), key);
      }
      // LensVisualizer's own words for it: no intersection in the stretch it searches, which is forward only, and
      // its classification calls that a ray that carries no light.
      const says = await lensVisualizerSays(ask.binding, opticalCase, spec, ray);
      assert.deepEqual(says, { status: "failed", failureReason: "noBracket", classified: "blocked" }, key);
    }
    // At the wide end of the zooms that cross at the tele end only, no ray is lost: the two engines stop the same.
    for (const [key] of TELE_ONLY_CROSSINGS) {
      for (const { r2 } of await tracedSets(ask, key, { state: { zoomT: 0 } })) {
        assert.equal(metricOf(r2, "mask.mismatches").value, 0, `${key} at the wide end`);
        assert.ok(r2.verdict === "PASS" || r2.verdict === "FLOOR", `${key} at the wide end: ${r2.reason}`);
      }
    }
    t.diagnostic(`rays LensVisualizer loses at crossing surfaces, by field: ${seen.join("; ")}`);
  },
);

test(
  "a ray that a steep surface turns back is stopped by both engines at the next surface: no mismatch",
  { skip, timeout: 600_000 },
  async (t) => {
    const ask = await engines(t);
    // fujifilm-fujinon-xf-27mm-f28 at 510 nm, full field: two rays of its lattice leave surface 10 at 94 degrees to
    // the axis. Their lines cross surface 11 behind them; neither engine takes that for a hit.
    const sets = await tracedSets(ask, "fujifilm-fujinon-xf-27mm-f28", { lines: { kind: "photopic" } });
    const set = sets.find(({ spec }) => spec.line === 2 && spec.groups?.field?.heightFraction === 1);
    assert.ok(set !== undefined);
    assert.equal(metricOf(set.r2, "mask.mismatches").value, 0);
    assert.equal(metricOf(set.r2, "mask.rimBand").value, 0);
    const [lvEnd, refEnd] = [decodeNdArray(set.lvData.endSurface).values, decodeNdArray(set.refData.endSurface).values];
    assert.deepEqual([...lvEnd], [...refEnd]);
    const directions = decodeNdArray(set.refData.hits).values;
    const rays = lvEnd.length;
    // The rays that end at surface 11 with a hit on surface 10 further from the object than surface 11's vertex.
    const turned = [...lvEnd.keys()].filter((ray) => {
      if (lvEnd[ray] !== 11) return false;
      const z10 = directions[(10 * rays + ray) * 3 + 2];
      return Number.isFinite(z10);
    });
    assert.ok(turned.length >= 2, String(turned));
    const says = await lensVisualizerSays(ask.binding, set.opticalCase, set.spec, turned[0]);
    t.diagnostic(
      `${turned.length} rays end at surface 11 in both engines; LensVisualizer says ${JSON.stringify(says)}`,
    );
  },
);

test(
  "where a steep surface magnifies LensVisualizer's tolerance, the floor rule says how far: FLOOR within its limits, FAIL beyond",
  { skip, timeout: 600_000 },
  async (t) => {
    const ask = await engines(t);
    const seen: string[] = [];
    const verdictsOf = async (key: string): Promise<{ r2: string[]; r3: string[]; sets: TracedSet[] }> => {
      const sets = await tracedSets(ask, key);
      const worst = (name: string, rung: "r2" | "r3"): number =>
        Math.max(...sets.map((set) => metricOf(set[rung], name).value ?? NaN));
      seen.push(
        `${key}: hits ${worst("hits.maxDistance", "r2")} mm, direction ${worst("direction.maxAbs", "r2")}, landing ` +
          `${worst("landing.maxDistance", "r2")} mm, path to image ${worst("opticalPathToImage.maxAbs", "r3")} waves`,
      );
      // Whatever else: not one ray that one engine stopped and the other passed.
      for (const set of sets) assert.equal(metricOf(set.r2, "mask.mismatches").value, 0, key);
      return { r2: sets.map((set) => set.r2.verdict), r3: sets.map((set) => set.r3.verdict), sets };
    };

    // Within the floor's limits, at the full field only: a hit 4e-8 mm off behind a surface that magnifies what
    // came before it forty times, on a wide zoom; a landing 2.2e-8 mm off behind an exit 64 degrees off the axis.
    for (const key of ["fujifilm-fujinon-xc-16-50mm-f35-56-ois-ii", "leica-apo-summicron-m-35f2"]) {
      const { r2, r3, sets } = await verdictsOf(key);
      assert.deepEqual(r2, ["PASS", "PASS", "FLOOR"], key);
      assert.deepEqual(r3, ["PASS", "PASS", "FLOOR"], key);
      assert.match(
        sets[2].r2.reason ?? "",
        /; floor of lv: lv against ref hits\.maxDistance \d\.\d\de-\d+ within 1\.00e-7, /,
      );
    }

    // Beyond them. A direction has no floor: 3.1e-9 on apple-iphone-12-main-wide, three times its gate, where the
    // hit is 1.09e-8 mm off; and on fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr a landing 1.02e-7 mm off, past the
    // limit of 1e-7 mm, behind a hit 9.8e-8 mm off. Both fail R2, and stay failed.
    for (const key of ["apple-iphone-12-main-wide", "fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr"]) {
      const { r2, sets } = await verdictsOf(key);
      assert.deepEqual(r2, ["PASS", "PASS", "FAIL"], key);
      assert.match(
        sets[2].r2.reason ?? "",
        /direction\.maxAbs \d\.\d\de-9 exceeds its tolerance 1\.00e-9 .*; not a floor of lv: direction\.maxAbs has no floor$/,
      );
      assert.ok((metricOf(sets[2].r2, "hits.maxDistance").value ?? 0) > 1e-8, key);
    }
    t.diagnostic(seen.join("; "));
  },
);
