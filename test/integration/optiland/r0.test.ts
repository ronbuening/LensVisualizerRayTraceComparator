// Rung R0 with optiland: the system optiland built for a case, re-read from its own objects, set against the
// reference engine's and LensVisualizer's, through the commands as a user runs them. A translation error would
// show here, before a ray is traced, and not later as two engines that disagree.
//
// The contract's own cases need optiland only; the suites need LensVisualizer too. Each test skips with the reason
// when one of them is missing. Run output goes to a temporary directory, and the worker's caches under this
// repository's gitignored cache directory.
//
// The figures quoted in comments were measured at optiland 4e893f53 and LensVisualizer b7deb221 (engine closure
// 46b028bc), and again at 1bf669ee (closure 66027121). Nothing is pinned to them but the verdicts: R0 holds what is
// copied to equality on any checkout, and the sag to its gate.
import assert from "node:assert/strict";
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test, type TestContext } from "node:test";

import { loadPolicy } from "../../../src/compare/policyFile.ts";
import type { OpticalCase } from "../../../src/contract/case.ts";
import type { SystemDescribeData } from "../../../src/contract/quantities/systemDescribe.ts";
import { DEFAULT_SAG_FRACTIONS, SYSTEM_DESCRIBE } from "../../../src/contract/quantities/systemDescribe.ts";
import { makeRequest } from "../../../src/contract/request.ts";
import { CONTRACT_VERSION } from "../../../src/contract/version.ts";
import type { RunManifest } from "../../../src/core/manifest.ts";
import { decodeNdArray } from "../../../src/core/numeric/ndarray.ts";
import { createEngineRegistry } from "../../../src/engines/registry.ts";
import { paraxialFirstOrderQuantity } from "../../../src/quantities/paraxialFirstOrder.ts";
import { raysTraceQuantity } from "../../../src/quantities/raysTrace.ts";
import { systemDescribeQuantity } from "../../../src/quantities/systemDescribe.ts";
import { caseFixture } from "../../core/support.ts";
import { suitePath } from "../../suites/support.ts";
import { LV_UNAVAILABLE } from "../lv/support.ts";
import { OPTILAND_UNAVAILABLE, optilandRoot, pairsOf, runAndCompare, worstOf } from "./support.ts";
import type { RungPair } from "./support.ts";

const skip = OPTILAND_UNAVAILABLE;
/** The suites are of LensVisualizer lenses: they need both. */
const skipSuites = OPTILAND_UNAVAILABLE || LV_UNAVAILABLE;
const R0 = loadPolicy().rungs.r0;
const COUNTS = ["layout.mismatches", "shape.mismatches", "aperture.mismatches", "index.mismatches"] as const;

/** What `lvrtc run` on rung R0 and `lvrtc compare` gave for a suite. */
interface R0Cycle {
  readonly manifest: RunManifest;
  /** Every pair of two engines, each once: three for each run on three engines. */
  readonly pairs: readonly RungPair[];
  /** The summary line of `lvrtc compare`. */
  readonly verdicts: string;
}

function r0Cycle(t: TestContext, suite: string, name: string, engines: string, root?: string): R0Cycle {
  const { manifest, comparisons, verdicts } = runAndCompare(t, { suite, name, engines, rungs: "r0", root });
  assert.ok(comparisons.comparisons.every((set) => set.rung === "r0"));
  return { manifest, pairs: pairsOf(comparisons, "r0", SYSTEM_DESCRIBE), verdicts };
}

/** Holds every pair to R0's gates as PASS, and says the worst sag of the pairs of optiland. */
function assertAllPass(t: TestContext, suite: string, pairs: readonly RungPair[]): void {
  for (const pair of pairs) {
    const said = `${pair.run}, ${pair.engines}: ${pair.reason ?? ""}`;
    assert.equal(pair.verdict, "PASS", said);
    // Everything an engine copies from the case is the same number in every engine: not one element differs.
    for (const count of COUNTS) assert.deepEqual(pair.metrics[count], { value: 0, where: "{}" }, `${said} ${count}`);
    const scaled = pair.metrics["sag.maxScaled"].value;
    assert.ok(scaled !== null && scaled <= (R0.metrics["sag.maxScaled"].tolerance ?? 0), said);
  }
  const optiland = pairs.filter((pair) => pair.engines.includes("optiland"));
  assert.ok(optiland.length > 0);
  for (const other of ["ref", "lv"]) {
    const against = optiland.filter((pair) => pair.engines.split(" / ").includes(other));
    if (against.length === 0) continue;
    const [scaled, plain] = [worstOf(against, "sag.maxScaled"), worstOf(against, "sag.maxAbs")];
    t.diagnostic(
      `${suite}, optiland against ${other}, ${against.length} pairs: sag.maxScaled ${scaled.value} (${scaled.at}); ` +
        `sag.maxAbs ${plain.value} mm (${plain.at})`,
    );
  }
}

// ── The contract's own cases: optiland against the reference engine ──────────────────────────────────────────────

test(
  "R0 of the contract's cases, the Double-Gauss among them: optiland built what ref built, to the bit and to rounding",
  { skip, timeout: 600_000 },
  (t) => {
    // The Double-Gauss case is derived from optiland's own sample lens; the every-feature case has an odd asphere on
    // a flat base, an annular aperture, a finite object, two lines and an image plane that is not the design one.
    const { rootDir } = optilandRoot(t);
    const names = ["singlet", "double-gauss", "all-features"];
    mkdirSync(join(rootDir, "cases"));
    for (const name of names) copyFileSync(caseFixture(name), join(rootDir, "cases", `${name}.json`));
    const suite = {
      contract: CONTRACT_VERSION,
      kind: "suite",
      name: "contract-cases",
      runs: names.map((name) => ({ name, lens: { kind: "fixture", path: `cases/${name}.json` } })),
    };
    writeFileSync(join(rootDir, "suite.json"), JSON.stringify(suite));

    const { manifest, pairs, verdicts } = r0Cycle(t, "suite.json", "contract-cases", "ref,optiland", rootDir);
    assert.deepEqual(
      manifest.jobs.map((job) => [job.run, job.rung, job.engine, job.status]),
      names.flatMap((name) => ["optiland", "ref"].map((engine) => [name, "r0", engine, "ok"])),
    );
    const optiland = manifest.engines.find((engine) => engine.id === "optiland");
    assert.ok(optiland !== undefined && optiland.status === "available");
    // What the manifest says of the engine holds no day of an install.
    assert.doesNotMatch(JSON.stringify(optiland), /\.d\d{8}/);
    assert.match(optiland.version, /^\d+\.\d+/);

    // Each request is compared against a reference and pair by pair: with two engines, the same pair twice.
    assert.equal(
      verdicts,
      "contract-cases: 6 pairs: 6 PASS, 0 FLOOR, 0 FAIL, 0 RECORDED, 0 ATTENTION, 0 UNSUPPORTED, 0 BLOCKED, 0 ERROR",
    );
    assert.deepEqual(
      pairs.map((pair) => [pair.run, pair.engines]),
      names.map((name) => [name, "optiland / ref"]),
    );
    assertAllPass(t, "contract-cases", pairs);
    // Measured: the largest sag difference of the three cases is 8.9e-16 mm, and 2.9e-16 on the scale of a rounding,
    // both on the Double-Gauss.
    assert.ok(worstOf(pairs, "sag.maxAbs").value < 1e-14, JSON.stringify(worstOf(pairs, "sag.maxAbs")));
  },
);

test(
  "what optiland describes is read from its optics: the annular aperture, the shifted image plane, a row for each line",
  { skip, timeout: 600_000 },
  async (t) => {
    const loaded = optilandRoot(t);
    const adapter = await createEngineRegistry(loaded).create("optiland");
    t.after(() => adapter.close());
    const descriptor = await adapter.describe();
    assert.deepEqual(descriptor.capabilities.quantities, {
      [SYSTEM_DESCRIBE]: { version: systemDescribeQuantity.version },
      [paraxialFirstOrderQuantity.id]: { version: paraxialFirstOrderQuantity.version },
      [raysTraceQuantity.id]: { version: raysTraceQuantity.version },
    });
    const opticalCase: OpticalCase = JSON.parse(readFileSync(caseFixture("all-features"), "utf8"));
    const request = makeRequest({ caseId: opticalCase.id, quantity: SYSTEM_DESCRIBE, spec: {} });
    const result = await adapter.run(request, opticalCase);
    assert.equal(result.status, "ok", JSON.stringify(result.error ?? result.unsupported));
    assert.deepEqual(systemDescribeQuantity.validateData(result.data), []);
    const data = result.data as SystemDescribeData;
    const f8 = (name: "innerClipRadius" | "clipRadius" | "vertexZ" | "sagRadii" | "sag" | "conic"): number[] => [
      ...decodeNdArray(data[name]).values,
    ];
    const { surfaces } = opticalCase.system;
    assert.deepEqual(
      f8("innerClipRadius"),
      surfaces.map((surface) => surface.aperture.innerSemiDiameter),
    );
    assert.deepEqual(f8("innerClipRadius"), [0, 0, 0, 2, 0, 0, 0]);
    assert.deepEqual(
      f8("clipRadius"),
      surfaces.map((surface) => surface.aperture.semiDiameter),
    );
    assert.deepEqual(
      f8("vertexZ"),
      surfaces.map((surface) => surface.z),
    );
    assert.equal(data.imageZ, opticalCase.conditions.imageZ);
    assert.notEqual(data.imageZ, opticalCase.system.designImageZ);
    assert.equal(data.stopSemiDiameter, opticalCase.conditions.stopSemiDiameter);
    assert.deepEqual(data.indexAfterSurface, opticalCase.conditions.indexAfterSurface);
    assert.deepEqual(data.sagRadii.$nd.shape, [surfaces.length, DEFAULT_SAG_FRACTIONS.length]);
    // Without fractions in the spec the nine default ones, of each surface's nominal semi-diameter.
    assert.deepEqual(
      f8("sagRadii").slice(0, 9),
      DEFAULT_SAG_FRACTIONS.map((fraction) => fraction * surfaces[0].aperture.nominalSemiDiameter),
    );
    // The flat-base asphere keeps the conic constant the case states, and its sag is its two terms.
    assert.deepEqual(f8("conic"), [-0.8, 0, 0, 0, 0, 0, 0]);
    assert.ok(Math.abs(f8("sag")[3 * 9 + 8] - (2e-5 * 9 ** 3 - 1e-6 * 9 ** 4)) < 1e-17);
    assert.deepEqual(result.method, {
      name: "optic-readback",
      params: { asphereTolerance: 1e-12, asphereMaxIterations: 100, positioning: "absolute-z" },
    });
    assert.deepEqual(result.diagnostics, { warnings: [], counts: { surfaces: 7, lines: 2 } });

    // A spec that is not the quantity's is the engine's own error.
    const unordered = makeRequest({
      caseId: opticalCase.id,
      quantity: SYSTEM_DESCRIBE,
      spec: { sagFractions: [1, 0] },
    });
    const refused = await adapter.run(unordered, opticalCase);
    assert.deepEqual([refused.status, refused.error?.code], ["error", "bad-spec"]);
  },
);

// ── The suites: lv, ref and optiland ─────────────────────────────────────────────────────────────────────────────

test(
  "the benchmark on R0: lv, ref and optiland built the same system for all 24 runs, at the reference and photopic lines",
  { skip: skipSuites, timeout: 900_000 },
  (t) => {
    const { manifest, pairs, verdicts } = r0Cycle(t, suitePath("benchmark"), "benchmark", "lv,ref,optiland");
    // 12 configurations, each at the reference line and at the five photopic lines; one request for each engine.
    assert.equal(manifest.runs.length, 24);
    assert.equal(manifest.jobs.length, 24 * 3);
    assert.ok(manifest.jobs.every((job) => job.status === "ok" && job.rung === "r0"));
    // Against a reference two pairs for each run, and pair by pair three.
    assert.equal(
      verdicts,
      "benchmark: 120 pairs: 120 PASS, 0 FLOOR, 0 FAIL, 0 RECORDED, 0 ATTENTION, 0 UNSUPPORTED, 0 BLOCKED, 0 ERROR",
    );
    // Three pairs of two engines for each run.
    assert.equal(pairs.length, 24 * 3);
    assert.deepEqual([...new Set(pairs.map((pair) => pair.engines))].sort(), [
      "lv / optiland",
      "lv / ref",
      "optiland / ref",
    ]);
    assertAllPass(t, "benchmark", pairs);
  },
);

test(
  "the feature suite on R0: every translation path passes three ways, and optiland declares nothing unsupported",
  { skip: skipSuites, timeout: 900_000 },
  (t) => {
    const { manifest, pairs, verdicts } = r0Cycle(t, suitePath("features"), "features", "lv,ref,optiland");
    // 16 runs as written, 18 as run: the fixed-iris zoom is run at both ends.
    assert.equal(manifest.runs.length, 18);
    assert.ok(manifest.runs.every((run) => run.caseId !== null && run.problems.length === 0));
    // An odd asphere, an e line, a term of power 20, an asphere on a flat base, a rear plate, a zoom, an asphere
    // without a term, a stop inside an element: optiland is asked about each and answers each. Were it to declare a
    // feature unsupported, the job would say so here, with the item, and docs/gotchas.md would have to say why.
    const refused = manifest.jobs.filter((job) => job.status !== "ok");
    assert.deepEqual(
      refused.map((job) => [job.run, job.engine, job.status, job.unsupported ?? job.error]),
      [],
    );
    assert.equal(
      verdicts,
      "features: 90 pairs: 90 PASS, 0 FLOOR, 0 FAIL, 0 RECORDED, 0 ATTENTION, 0 UNSUPPORTED, 0 BLOCKED, 0 ERROR",
    );
    assert.equal(pairs.length, 18 * 3);
    assertAllPass(t, "features", pairs);
  },
);
