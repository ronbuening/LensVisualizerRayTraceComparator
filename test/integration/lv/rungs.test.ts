// Rungs R2 and R3 of `lv` against `ref` on the real LensVisualizer: the committed suites through the commands, as a
// user runs them, and the lenses of the catalog on which LensVisualizer does what a comparison must know about.
// `ref` is the arbiter here: its own proof is the analytic tests of test/engines/ref, which need no LensVisualizer.
// Run output goes to a temporary directory.
//
// The numbers quoted in comments, and the pinned ones, were measured at LV commit 3af45e3f with the catalog of that
// commit; its engine files are those of the d36f44b3 working tree the earlier stages name (closure f6681074). The
// verdicts under the floor of the exit direction (policy version 4) were taken at 1ed8cc3d (closure ff670f03), where
// the figures of these lenses are those of 3af45e3f to every digit quoted.
//
// Historical figures describe the old intersection tolerance of 1e-9 mm. Assertions hold upper bounds and
// PASS under policy version 11, with the rewritten engine and its 1e-12 mm tolerance.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test, type TestContext } from "node:test";
import { fileURLToPath } from "node:url";

import { buildBaseline, parseBaseline } from "../../../src/baseline/build.ts";
import { checkBaseline } from "../../../src/baseline/check.ts";
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
import { lvFieldAngles, lvLaunchSetup } from "../../../src/engines/lv/raySets.ts";
import { lvTraceOptions } from "../../../src/engines/lv/rays.ts";
import { createRefEngine } from "../../../src/engines/ref/engine.ts";
import { RemoteEngineAdapter } from "../../../src/engines/remote.ts";
import { DEFAULT_BUNDLE_GRID, raySetSpec } from "../../../src/rays/raySets.ts";
import { createInProcessTransport } from "../../../src/transports/inProcess.ts";
import { suitePath } from "../../suites/support.ts";
import { LV_PATH, LV_UNAVAILABLE } from "./support.ts";

const skip = LV_UNAVAILABLE;
const BIN = fileURLToPath(new URL("../../../bin/lvrtc.mjs", import.meta.url));
const POLICY = loadPolicy();
/** The baseline of the benchmark that is committed: lv, ref and optiland on R0 to R3. */
const COMMITTED_BASELINE = join(REPO_ROOT, "baselines", "benchmark.json");

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

/** What a suite came to on the four rungs of the ladder, through `lvrtc run`, `compare` and `report`. */
interface Cycle {
  readonly manifest: RunManifest;
  readonly comparisons: ComparisonFile;
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
  const reported = lvrtc(runsDir, "report", suite);
  assert.equal(reported.code, 0, reported.err);
  const refused = lvrtc(runsDir, "report", suite, "--floor", join(runsDir, "digest"));
  assert.equal(refused.code, 2, refused.err);
  assert.match(refused.err, /the policy gives no engine a floor/);
  const read = (...path: string[]): string => readFileSync(join(runsDir, ...path), "utf8");
  return {
    manifest: JSON.parse(read(suite, MANIFEST_FILE)),
    comparisons: JSON.parse(read(suite, COMPARISONS_FILE)),
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
  "the benchmark: lv and ref agree on R0 to R3 at the reference and the photopic lines, as the committed baseline records",
  { skip, timeout: 600_000 },
  (t) => {
    const { manifest, comparisons, verdicts } = cycle(t, "benchmark");
    // 96 runs: 12 configurations in four conditions (wide open and the tab's f/8, at the design plane and at
    // LensVisualizer's best axial focus), on one line and on five. R0 and R1 once each, and 864 ray sets (three
    // fields a line), which each engine traces once for R2 and R3 together.
    assert.equal(manifest.jobs.length, 2 * (96 + 96 + 864 + 864));
    assert.equal(
      manifest.runs.reduce((sets, run) => sets + (run.raySets?.sets.length ?? 0), 0),
      864,
    );
    assert.ok(manifest.jobs.every((job) => job.status === "ok"));

    // Every gated pair is PASS, and nothing else: no failure, no error, nothing blocked.
    assert.match(
      verdicts,
      /^benchmark: 3840 pairs: 3840 PASS, 0 FLOOR, 0 FAIL, 0 RECORDED, 0 ATTENTION, 0 UNSUPPORTED, 0 BLOCKED, 0 ERROR$/,
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
    // carried through the surfaces behind it. At 33ebdb30 (closure 78215d72) the 72 runs of the three other
    // conditions pass outright too: stopped down the rays are a part of these, and a moved image plane moves
    // nothing but the landing and the path to it. At 31c34396 (closure a52a7b8e), whose intersection tolerance is
    // 1e-12 mm, the same pairs pass with a hit distance of 1.9e-12 mm, a direction of 8.0e-14 and a landing of
    // 2.4e-12 mm at the most. The bounds are upper bounds: a more accurate LensVisualizer is not a failure.
    assert.deepEqual(counts, { "r0 PASS": 96, "r1 PASS": 96, "r2 PASS": 864, "r3 PASS": 864 });
    assert.equal(floors.size, 0);
    assert.ok(r2["hits.maxDistance"].value < 1e-8, said(r2, R2_METRICS));
    assert.ok(r2["direction.maxAbs"].value < 1e-9 && r2["landing.maxDistance"].value < 1e-8, said(r2, R2_METRICS));
    for (const name of R3_METRICS) assert.ok(r3[name].value < 2e-5, said(r3, R3_METRICS));

    // No floor remains in the real policy, at either rung or metric level.
    for (const rung of [POLICY.rungs.r2, POLICY.rungs.r3]) {
      assert.equal(rung.floor, undefined);
      assert.ok(Object.values(rung.metrics).every((metric) => metric.floor === undefined));
    }

    // The committed baseline holds these figures for lv against ref, wherever it was taken, as long as both
    // engines, the policy and the case of a run are the ones it names. The baseline is of three engines; this run
    // is of two, so only the records of this pair are held. A record that is stale is a record of what it names:
    // `lvrtc baseline check benchmark` says whether it still holds.
    assert.ok(existsSync(COMMITTED_BASELINE), "baselines/benchmark.json is committed");
    const read = parseBaseline(readFileSync(COMMITTED_BASELINE, "utf8"));
    assert.ok("baseline" in read, JSON.stringify(read));
    const fresh = buildBaseline(manifest, comparisons, POLICY);
    const records = checkBaseline(read.baseline, fresh, POLICY).filter(
      (record) => record.a === "lv" && record.b === "ref" && record.outcome !== "GONE",
    );
    assert.equal(records.length, 4 * 96);
    const held = records.filter((record) => record.stale.length === 0);
    for (const record of held) {
      assert.equal(record.outcome, "OK", `${record.run} ${record.rung}: ${record.moved.join("; ")}`);
    }
    t.diagnostic(
      `baselines/benchmark.json: ${held.length} of ${records.length} records of lv and ref are of the cases and ` +
        `engines here and hold; ${records.filter((record) => record.outcome === "DRIFT").length} drifted`,
    );
  },
);

// ── The feature suite ────────────────────────────────────────────────────────────────────────────────────────────

test(
  "the feature suite: every pair is PASS on R0 to R3 under policy version 11, with no R2 or R3 floor",
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
      /^features: 720 pairs: 720 PASS, 0 FLOOR, 0 FAIL, 0 RECORDED, 0 ATTENTION, 0 UNSUPPORTED, 0 BLOCKED, 0 ERROR$/,
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
    // That is LensVisualizer's intersection tolerance of 1e-9 mm. At 31c34396, where it is 1e-12 mm, no pair is a
    // floor: every pair of the suite passes. Policy version 11 removes the floors entirely.
    assert.deepEqual(counts, { "r0 PASS": 18, "r1 PASS": 18, "r2 PASS": 162, "r3 PASS": 162 });
    assert.equal(floors.size, 0);
    // The hits themselves are inside their gate on every lens: it is the landing, behind a steep exit, that at a
    // tolerance of 1e-9 mm is not.
    assert.ok(r2["hits.maxDistance"].value < 1e-8, said(r2, R2_METRICS));
    assert.ok(r2["direction.maxAbs"].value < 1e-9, said(r2, R2_METRICS));
    assert.ok(r2["landing.maxDistance"].value < 1e-8, said(r2, R2_METRICS));
    assert.ok(r3["opticalPath.maxAbs"].value < 2e-5, said(r3, R3_METRICS));
    assert.ok(r3["opticalPathToImage.maxAbs"].value < 2e-5, said(r3, R3_METRICS));
    assert.ok(r3["opd.maxAbs"].value < 2e-5, said(r3, R3_METRICS));
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
  for (const spec of sets) traced.push(await tracedSet(ask, key, opticalCase, spec));
  return traced;
}

/** One ray set of a case traced by `lv` and `ref`, with the two rungs' pairs. */
async function tracedSet(
  ask: { lv: RemoteEngineAdapter; ref: RemoteEngineAdapter },
  key: string,
  opticalCase: OpticalCase,
  spec: RaysTraceSpec,
): Promise<TracedSet> {
  {
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
    return {
      opticalCase,
      spec,
      lvData: mine.data as RaysTraceData,
      refData: theirs.data as RaysTraceData,
      r2: pairOf("r2"),
      r3: pairOf("r3"),
    };
  }
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
  const trace = binding.api.traceEngineRay(
    model.state,
    {
      origin: [origins[3 * ray], origins[3 * ray + 1], origins[3 * ray + 2]],
      direction: [directions[3 * ray], directions[3 * ray + 1], directions[3 * ray + 2]],
    },
    lvTraceOptions(model, spec.line),
  );
  const classified = binding.api.traceRayClassification(trace, model.state, opticalCase.conditions.stopSemiDiameter);
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
 * The lenses in which a surface lay behind the one before it within both clear apertures at LV ed78cf40, with the
 * surface at which LensVisualizer lost rays then: a stop or a flat face set into the curve of its neighbour. A zoom is
 * named with the end it does so at: at its default state, the wide end, where none is named. Since LV #934 its
 * sequential trace meets such a surface by a step backwards, as `ref` does; #929 moved three of these stops out of
 * the glass (the Leica 90, the Olympus 50/1.4, the Sonnar 50/2) and #928 cut the Nokton's surface 8 at its stop plane.
 */
const CROSSING_SURFACES: readonly (readonly [key: string, surface: number, zoomT?: 1])[] = [
  ["bertele-sonnar-50f2-scaled", 6],
  ["leica-elmarit-90f28", 5],
  ["nokton-50f1", 7],
  ["olympus-zuiko-auto-s-50f14", 6],
  ["pentax-da-18-55mm-f35-56-al", 15],
  ...TELE_ONLY_CROSSINGS,
];
// vivitar-series-1-70-210-f35 was one of them at both ends, its stop set into surface 21, until LensVisualizer
// placed the stop 1.2 mm behind that surface (its lens file at 31c34396): a lens whose data was corrected is no
// example of the defect any more, at either commit's reading of it.

test(
  "where two surfaces cross inside their clear apertures LensVisualizer steps back as ref does, and R2 passes",
  { skip, timeout: 600_000 },
  async (t) => {
    const ask = await engines(t);
    const seen: string[] = [];
    let backwards = 0;
    for (const [key, surface, zoomT] of CROSSING_SURFACES) {
      const sets = await tracedSets(ask, key, zoomT === undefined ? {} : { state: { zoomT } });
      let stepped = 0;
      for (const { opticalCase, spec, lvData, refData, r2 } of sets) {
        // No ray that one engine stops and the other passes: the pair passes, and the mask is the same.
        assert.equal(metricOf(r2, "mask.mismatches").value, 0, key);
        assert.equal(r2.verdict, "PASS", `${key}: ${r2.reason}`);
        const rays = lvData.status.$nd.shape[0];
        const [lvStatus, refStatus] = [decodeNdArray(lvData.status).values, decodeNdArray(refData.status).values];
        const [lvHits, refHits] = [decodeNdArray(lvData.hits).values, decodeNdArray(refData.hits).values];
        const z = (hits: ArrayLike<number>, at: number, ray: number): number => hits[(at * rays + ray) * 3 + 2];
        for (let ray = 0; ray < rays; ray++) {
          // A ray ref meets the surface with behind its hit on the surface before: a step backwards along a ray that
          // travels forwards. LensVisualizer meets it there too since #934, and ends it as ref does.
          if (!(z(refHits, surface, ray) < z(refHits, surface - 1, ray))) continue;
          assert.equal(lvStatus[ray], refStatus[ray], `${key} ray ${ray}`);
          assert.ok(
            z(lvHits, surface, ray) < z(lvHits, surface - 1, ray),
            `${key} ray ${ray}: LensVisualizer stepped back`,
          );
          assert.ok(Math.abs(z(lvHits, surface, ray) - z(refHits, surface, ray)) < 1e-8, `${key} ray ${ray}`);
          if (stepped === 0) {
            // LensVisualizer's own words for the first such ray: no noBracket at the surface behind the hit.
            const says = await lensVisualizerSays(ask.binding, opticalCase, spec, ray);
            assert.notEqual(says.failureReason, "noBracket", `${key} ray ${ray}`);
          }
          stepped++;
        }
      }
      backwards += stepped;
      seen.push(`${key}${zoomT === undefined ? "" : " at the tele end"} surface ${surface}: ${stepped} rays step back`);
    }
    t.diagnostic(`rays both engines meet by a step backwards: ${seen.join("; ")}`);
    assert.ok(backwards > 0, "no ray of these lenses steps back: the class is not exercised");
    // At the wide end of the zooms that cross at the tele end only, the two engines stop the same as ever.
    for (const [key] of TELE_ONLY_CROSSINGS) {
      for (const { r2 } of await tracedSets(ask, key, { state: { zoomT: 0 } })) {
        assert.equal(metricOf(r2, "mask.mismatches").value, 0, `${key} at the wide end`);
        assert.equal(r2.verdict, "PASS", `${key} at the wide end: ${r2.reason}`);
      }
    }
  },
);

test(
  "a ray that a steep surface turns back is stopped by both engines at the next surface: no mismatch",
  { skip, timeout: 600_000 },
  async (t) => {
    const ask = await engines(t);
    // fujifilm-fujinon-xf-27mm-f28 at 510 nm, full field, on LensVisualizer's launch-plane lattice over the field's
    // footprint (its MTF's sampling before #936, which its exports still lay). At 098c91ef6 two of its rays left
    // surface 10 at 94 degrees to the axis; their lines crossed surface 11 behind them, and neither engine took that
    // for a hit. LensVisualizer 2e7c81088 capped that asphere's rim (8A) at 4.91 mm, below its turnover (its rim angle
    // -2.53 degrees, 62.16 before), and at 607ff23ae no ray of the catalog's launch-plane lattices turns back (none of
    // 1,900 exports, fields 0.7, 0.9 and 1 of the image height, 32 cells, every line). The rule stays held by the
    // tracer's canary (#934 steps back only for a ray that still travels toward +z) and by ref's analytic test of a
    // turned ray; this test holds the steep field to no mismatch and says how many rays turned back, if any did.
    const key = "fujifilm-fujinon-xf-27mm-f28";
    const options: RunOptions = { lines: { kind: "photopic" } };
    const exported = await ask.exporter.exportLens(key, options);
    assert.ok(exported.ok, key);
    const rebuilt = await rebuildCase(ask.binding, createLensBuilder(ask.binding), exported.opticalCase);
    assert.ok(rebuilt.ok, key);
    const { api } = ask.binding;
    const setup = lvLaunchSetup(api, rebuilt.model);
    assert.ok(!("problem" in setup));
    const [field] = lvFieldAngles(api, rebuilt.model, setup, { kind: "image-height-fractions", values: [1] });
    assert.ok(!("problem" in field));
    const launch = api.prepareMtfFieldLaunch(rebuilt.model.state, setup.options, setup.support, field.angleDeg);
    assert.ok(launch !== null);
    const footprint = api.findMtfFieldFootprint(rebuilt.model.state, setup.options, setup.support, launch);
    assert.ok(footprint !== null);
    const grid = api.mtfLaunchGrid(footprint, DEFAULT_BUNDLE_GRID);
    const cells = grid.columns * grid.rows;
    const [origins, directions] = [new Float64Array(3 * (cells + 1)), new Float64Array(3 * (cells + 1))];
    for (let cell = 0; cell <= cells; cell++) {
      const [row, column] = [Math.floor(cell / grid.columns), cell % grid.columns];
      const ray =
        cell === cells
          ? api.mtfLaunchRay(launch, 0, 0)
          : api.mtfLaunchRay(launch, grid.x0 + (column + 0.5) * grid.step, grid.y0 + (row + 0.5) * grid.step);
      origins.set(ray.origin, 3 * cell);
      directions.set(ray.direction, 3 * cell);
    }
    const weights = new Float64Array(cells + 1).fill(1);
    weights[cells] = 0;
    const set = await tracedSet(ask, key, exported.opticalCase, {
      ...raySetSpec(2, { origins, directions, weights }),
      groups: { field, lattice: { columns: grid.columns, rows: grid.rows, step: grid.step }, chiefIndex: cells },
    });
    assert.equal(metricOf(set.r2, "mask.mismatches").value, 0);
    assert.equal(metricOf(set.r2, "mask.rimBand").value, 0);
    const [lvEnd, refEnd] = [decodeNdArray(set.lvData.endSurface).values, decodeNdArray(set.refData.endSurface).values];
    assert.deepEqual([...lvEnd], [...refEnd]);
    // The rays LensVisualizer leaves travelling toward the object: each must have ended in both engines, at one surface.
    const turned: number[] = [];
    const traceOptions = lvTraceOptions(rebuilt.model, set.spec.line);
    for (let ray = 0; ray < cells; ray++) {
      const at = (values: Float64Array): [number, number, number] => [
        values[3 * ray],
        values[3 * ray + 1],
        values[3 * ray + 2],
      ];
      const trace = api.traceEngineRay(
        rebuilt.model.state,
        { origin: at(origins), direction: at(directions) },
        traceOptions,
      );
      if (trace.status !== "ok" && !(trace.terminalDirection[2] > 1e-12)) turned.push(ray);
    }
    const lvStatus = decodeNdArray(set.lvData.status).values;
    const refStatus = decodeNdArray(set.refData.status).values;
    for (const ray of turned) {
      assert.notEqual(lvStatus[ray], RAY_STATUS.ok, `ray ${ray}`);
      assert.notEqual(refStatus[ray], RAY_STATUS.ok, `ray ${ray}`);
    }
    t.diagnostic(
      turned.length === 0
        ? `no ray of the lattice turns back at this LensVisualizer (${cells} cells)`
        : `${turned.length} rays turn back and end at surfaces ${turned.map((ray) => lvEnd[ray]).join(" ")} in both engines`,
    );
  },
);

test(
  "steep catalog fields stay within the gates under policy version 11, without any floor at any engine closure",
  { skip, timeout: 600_000 },
  async (t) => {
    const ask = await engines(t);
    const seen: string[] = [];
    const worstOver = (sets: readonly TracedSet[], name: string, rung: "r2" | "r3"): number =>
      Math.max(...sets.map((set) => metricOf(set[rung], name).value ?? NaN));
    const verdictsOf = async (
      key: string,
      options: RunOptions = {},
    ): Promise<{ r2: string[]; r3: string[]; sets: TracedSet[] }> => {
      const sets = await tracedSets(ask, key, options);
      seen.push(
        `${key}${options.lines?.kind === "photopic" ? " (photopic)" : ""}: hits ` +
          `${worstOver(sets, "hits.maxDistance", "r2")} mm, direction ${worstOver(sets, "direction.maxAbs", "r2")}, ` +
          `landing ${worstOver(sets, "landing.maxDistance", "r2")} mm, path to image ` +
          `${worstOver(sets, "opticalPathToImage.maxAbs", "r3")} waves; R2 ${sets.map((set) => set.r2.verdict).join(" ")}`,
      );
      // Whatever else: not one ray that one engine stopped and the other passed.
      for (const set of sets) assert.equal(metricOf(set.r2, "mask.mismatches").value, 0, key);
      return { r2: sets.map((set) => set.r2.verdict), r3: sets.map((set) => set.r3.verdict), sets };
    };
    const photopic: RunOptions = { lines: { kind: "photopic" } };
    const lenses: [string, RunOptions][] = [
      ["fujifilm-fujinon-xc-16-50mm-f35-56-ois-ii", {}],
      ["leica-apo-summicron-m-35f2", {}],
      ["apple-iphone-12-main-wide", {}],
      ["apple-iphone-7-wide-camera-lens", photopic],
      ["fujifilm-fujinon-xf-27mm-f28", photopic],
      ["leica-apo-summicron-m-35f2", photopic],
      ["fujifilm-fujinon-xf-8-16mm-f28-r-lm-wr", photopic],
    ];
    const verdicts: string[] = [];
    for (const [key, options] of lenses) {
      const { r2, r3 } = await verdictsOf(key, options);
      verdicts.push(...r2, ...r3);
    }
    const count = (verdict: string): number => verdicts.filter((other) => other === verdict).length;
    t.diagnostic(seen.join("; "));
    assert.equal(count("PASS"), verdicts.length, `a pair did not PASS: ${verdicts}`);
    assert.ok(verdicts.length > 0, "no pair was judged");
  },
);
