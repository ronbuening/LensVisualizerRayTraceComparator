// Rungs R0 and R1 from end to end: the reference engine against copies of itself that built another system than
// the one they were given. R0 must fail and name what differs; R1 must then be blocked for that pair on that case,
// and say so. The copies are the test-only engine of test/engines/ref/bentEngine.ts.
import assert from "node:assert/strict";
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test, type TestContext } from "node:test";
import { fileURLToPath } from "node:url";

import { createCompareCommand } from "../../src/cli/commands/compare.ts";
import { createReportCommand } from "../../src/cli/commands/report.ts";
import { createRunCommand } from "../../src/cli/commands/run.ts";
import { EXIT_FAILURE, EXIT_OK, runCli } from "../../src/cli/main.ts";
import { COMPARISONS_FILE } from "../../src/compare/comparisonFile.ts";
import type { ComparisonFile } from "../../src/compare/comparisonFile.ts";
import { compareManifest } from "../../src/compare/manifest.ts";
import { loadPolicy } from "../../src/compare/policyFile.ts";
import type { OpticalCase } from "../../src/contract/case.ts";
import type { PairComparison } from "../../src/contract/comparison.ts";
import { CONTRACT_VERSION } from "../../src/contract/version.ts";
import { CONFIG_FILE } from "../../src/core/config.ts";
import { runSuite } from "../../src/core/orchestrator.ts";
import { STORE_DIRECTORY, createResultStore } from "../../src/core/resultStore.ts";
import { createRefEngine } from "../../src/engines/ref/engine.ts";
import { RemoteEngineAdapter } from "../../src/engines/remote.ts";
import { REPORT_JSON_FILE, REPORT_MARKDOWN_FILE } from "../../src/report/index.ts";
import type { ReportModel } from "../../src/report/model.ts";
import { createInProcessTransport } from "../../src/transports/inProcess.ts";
import { DOUBLE_GAUSS, caseFixture, suiteOf, tempDir, watchedRegistry } from "../core/support.ts";
import type { EngineMaker } from "../core/support.ts";
import { createEngine as createBentEngine } from "../engines/ref/bentEngine.ts";
import type { BentOptions } from "../engines/ref/bentEngine.ts";
import { caseOf, sphere } from "../engines/ref/support.ts";

const BENT_ENGINE = fileURLToPath(new URL("../engines/ref/bentEngine.ts", import.meta.url));

// ── Through the commands ─────────────────────────────────────────────────────────────────────────────────────────

/**
 * A root with two copies of the reference engine beside the built-in one. `ref-twin` is faithful. `ref-bent` holds
 * the radius of the ninth surface one part in 1e9 too long: the Double-Gauss has such a surface, and the singlet
 * has not.
 */
function ladderRoot(t: TestContext): string {
  const rootDir = join(tempDir(t), "root");
  const bent: BentOptions = {
    id: "ref-bent",
    edits: [{ pointer: "/system/surfaces/8/shape/radius", scale: 1 + 1e-9 }],
  };
  const config = {
    engines: {
      "ref-bent": { transport: "in-process", module: BENT_ENGINE, options: bent },
      "ref-twin": { transport: "in-process", module: BENT_ENGINE, options: { id: "ref-twin" } },
    },
  };
  const suite = {
    contract: CONTRACT_VERSION,
    kind: "suite",
    name: "ladder",
    defaults: { rungs: ["r0", "r1"], engines: ["ref", "ref-bent", "ref-twin"], referenceEngine: "ref" },
    runs: [
      { name: "singlet", lens: { kind: "fixture", path: "cases/singlet.json" } },
      { name: "double-gauss", lens: { kind: "fixture", path: "cases/double-gauss.json" } },
    ],
  };
  mkdirSync(join(rootDir, "cases"), { recursive: true });
  writeFileSync(join(rootDir, CONFIG_FILE), JSON.stringify(config));
  writeFileSync(join(rootDir, "suite.json"), JSON.stringify(suite));
  for (const name of ["singlet", "double-gauss"])
    copyFileSync(caseFixture(name), join(rootDir, "cases", `${name}.json`));
  return rootDir;
}

/** Runs `lvrtc run`, `compare` and `report` on the root's suite, in this process, and returns what each did. */
async function cycle(rootDir: string): Promise<{ code: number; out: string; err: string }[]> {
  const inputs = { rootDir, cwd: rootDir, env: {} };
  const commands = [createRunCommand(inputs), createCompareCommand(inputs), createReportCommand(inputs)];
  const steps = [];
  for (const args of [
    ["run", "suite.json"],
    ["compare", "ladder"],
    ["report", "ladder"],
  ]) {
    const out: string[] = [];
    const err: string[] = [];
    const io = { stdout: (text: string) => void out.push(text), stderr: (text: string) => void err.push(text) };
    steps.push({ code: await runCli(args, io, commands), out: out.join(""), err: err.join("") });
  }
  return steps;
}

test("ref against a copy that built another surface: R0 fails and names it, and R1 is blocked for that pair", async (t) => {
  const rootDir = ladderRoot(t);
  const [ran, compared, reported] = await cycle(rootDir);
  // Every engine answered every request: a wrong system is an answer, not an error.
  assert.equal(ran.code, EXIT_OK, ran.err);
  assert.match(ran.out, /^ladder: 12 jobs: 12 ok, 0 unsupported, 0 error, 0 pending \(12 computed, 0 cached\)$/m);
  assert.equal(compared.code, EXIT_FAILURE, compared.err);
  assert.match(
    compared.out,
    /^ladder: 20 pairs: 14 PASS, 0 FLOOR, 3 FAIL, 0 RECORDED, 0 ATTENTION, 0 UNSUPPORTED, 3 BLOCKED, 0 ERROR$/m,
  );
  assert.equal(reported.code, EXIT_OK, reported.err);

  const directory = join(rootDir, "runs", "ladder");
  const file: ComparisonFile = JSON.parse(readFileSync(join(directory, COMPARISONS_FILE), "utf8"));
  const pairOf = (run: string, rung: string, mode: string, a: string, b: string): PairComparison => {
    const set = file.comparisons.find((each) => each.run === run && each.rung === rung && each.mode === mode);
    const pair = set?.pairs.find((each) => each.a === a && each.b === b);
    assert.ok(pair !== undefined, `${run} ${rung} ${mode} ${a} ${b}`);
    return pair;
  };

  // The singlet has no ninth surface, so there the copy is faithful: everything passes, with no difference at all.
  for (const rung of ["r0", "r1"]) {
    for (const engine of ["ref-bent", "ref-twin"]) {
      const pair = pairOf("singlet", rung, "reference-vs-each", "ref", engine);
      assert.equal(pair.verdict, "PASS", `${rung} ${engine}`);
      assert.ok(
        pair.metrics.every((metric) => metric.value === 0),
        `${rung} ${engine}`,
      );
    }
  }

  // The Double-Gauss: R0 fails for the bent copy, on the curvature of surface 8 and on the sag that follows from it.
  const failed = pairOf("double-gauss", "r0", "reference-vs-each", "ref", "ref-bent");
  assert.equal(failed.verdict, "FAIL");
  const metrics = Object.fromEntries(failed.metrics.map((metric) => [metric.name, metric]));
  assert.deepEqual(metrics["shape.mismatches"], {
    name: "shape.mismatches",
    value: 1,
    unit: "elements",
    where: { field: "curvature", surface: 8 },
  });
  for (const name of ["layout.mismatches", "aperture.mismatches", "index.mismatches"]) {
    assert.deepEqual(metrics[name], { name, value: 0, unit: "elements" });
  }
  // A sphere of radius R has the sag R - s at the height r, with s = sqrt(R^2 - r^2), and a radius one part in
  // 1e9 too long changes it by (R / s - 1) R * 1e-9: 4.2e-9 mm at the rim of this surface.
  const [radius, r] = [37.92546, 16.45];
  const s = Math.sqrt(radius * radius - r * r);
  const expected = (radius / s - 1) * radius * 1e-9;
  assert.deepEqual(metrics["sag.maxAbs"].where, { surface: 8, sample: 8 });
  const sag = metrics["sag.maxAbs"].value ?? NaN;
  assert.ok(Math.abs(sag - expected) < 1e-3 * expected, `${sag} against ${expected}`);
  assert.match(
    failed.reason ?? "",
    /^sag\.maxScaled \d\.\d\de-(9|10) exceeds its tolerance 1\.00e-12 at sample 8, surface 8; shape\.mismatches 1 exceeds its tolerance 0 at field curvature, surface 8$/,
  );
  // The faithful copy passes R0 on the same case, and so is judged in R1, where it agrees to the last bit.
  assert.equal(pairOf("double-gauss", "r0", "reference-vs-each", "ref", "ref-twin").verdict, "PASS");
  assert.deepEqual(pairOf("double-gauss", "r1", "reference-vs-each", "ref", "ref-twin"), {
    a: "ref",
    b: "ref-twin",
    metrics: [
      { name: "firstOrder.maxAbs", value: 0, unit: "mm", where: { quantity: "efl", line: 0 } },
      { name: "pupilZ.maxScaled", value: 0, unit: "mm", where: { quantity: "entrancePupilZ", line: 0 } },
      { name: "pupilZ.maxAbs", value: 0, unit: "mm", where: { quantity: "entrancePupilZ", line: 0 } },
      {
        name: "pupilRadius.maxScaled",
        value: 0,
        unit: "mm",
        where: { quantity: "entrancePupilSemiDiameter", line: 0 },
      },
      { name: "pupilRadius.maxAbs", value: 0, unit: "mm", where: { quantity: "entrancePupilSemiDiameter", line: 0 } },
    ],
    class: "gated",
    verdict: "PASS",
  });

  // R1 of the bent copy is not judged, against the reference or against the twin, and says which rung blocks it.
  assert.deepEqual(pairOf("double-gauss", "r1", "reference-vs-each", "ref", "ref-bent"), {
    a: "ref",
    b: "ref-bent",
    metrics: [],
    class: "gated",
    verdict: "BLOCKED",
    reason: "not judged: rung r0 failed for ref and ref-bent on this case",
  });
  assert.equal(pairOf("double-gauss", "r0", "pairwise", "ref-bent", "ref-twin").verdict, "FAIL");
  assert.deepEqual(pairOf("double-gauss", "r1", "pairwise", "ref-bent", "ref-twin"), {
    a: "ref-bent",
    b: "ref-twin",
    metrics: [],
    class: "gated",
    verdict: "BLOCKED",
    reason: "not judged: rung r0 failed for ref-bent and ref-twin on this case",
  });
  assert.equal(pairOf("double-gauss", "r1", "pairwise", "ref", "ref-twin").verdict, "PASS");
});

test("the report shows the mismatching surface in R0, and the blocked R1 as a row with its reason", async (t) => {
  const rootDir = ladderRoot(t);
  await cycle(rootDir);
  const directory = join(rootDir, "runs", "ladder");
  const markdown = readFileSync(join(directory, REPORT_MARKDOWN_FILE), "utf8");
  const model: ReportModel = JSON.parse(readFileSync(join(directory, REPORT_JSON_FILE), "utf8"));

  // The failures are R0's; a blocked pair is counted and is not one of them.
  assert.equal(model.failing, 3);
  assert.match(markdown, /^3 of 20 pairs are FAIL or ERROR\.$/m);
  assert.match(markdown, /^\| FAIL \| 1 \| 2 \|$/m);
  assert.match(markdown, /^\| BLOCKED \| 1 \| 2 \|$/m);

  // R0: the counts read as counts, the limits as limits, and the place of the mismatch is in its cell. The plain
  // difference of the sag, which is shown and not judged, stands beside the scaled one that is.
  const header =
    "| Engine | aperture.mismatches (≤ 0 elements) | index.mismatches (≤ 0 elements) | " +
    "layout.mismatches (≤ 0 elements) | sag.maxScaled (≤ 1.00e-12) | sag.maxAbs [mm] | " +
    "shape.mismatches (≤ 0 elements) | Verdict | Note |";
  assert.ok(markdown.includes(`\n${header}\n`), markdown);
  assert.match(
    markdown,
    /^\| ref-bent \| 0 \| 0 \| 0 \| \d\.\d\de-(9|10) at sample 8, surface 8 \| 4\.\d\de-9 at sample 8, surface 8 \| 1 at field curvature, surface 8 \| FAIL \| sag\.maxScaled /m,
  );
  assert.match(
    markdown,
    /^\| ref-twin \| 0 \| 0 \| 0 \| 0 at sample 0, surface 0 \| 0 at sample 0, surface 0 \| 0 \| PASS \| {2}\|$/m,
  );
  assert.match(markdown, /^Quantity `system\.describe`, compared direct, gated\. /m);

  // R1: the worst quantity and its line for the pair that was judged, and the blocked pair with why.
  // The radius and the position of a pupil have two columns each: on the scale of the pupil's distance, which is
  // judged, and the plain figure beside it.
  const firstOrder =
    "| Engine | firstOrder.maxAbs (≤ 1.00e-9 mm) | pupilRadius.maxScaled (≤ 1.00e-9 mm) | pupilRadius.maxAbs [mm] | " +
    "pupilZ.maxScaled (≤ 1.00e-9 mm) | pupilZ.maxAbs [mm] | Verdict | Note |";
  assert.ok(markdown.includes(`\n${firstOrder}\n`));
  const pupil = "0 at line 0, quantity entrancePupilZ";
  const radius = "0 at line 0, quantity entrancePupilSemiDiameter";
  assert.ok(
    markdown.includes(
      `\n| ref-twin | 0 at line 0, quantity efl | ${radius} | ${radius} | ${pupil} | ${pupil} | PASS |  |\n`,
    ),
  );
  assert.match(
    markdown,
    /^\| ref-bent \| — \| — \| — \| — \| — \| BLOCKED \| not judged: rung r0 failed for ref and ref-bent on this case \|$/m,
  );
  // And in the pairwise matrix of that rung.
  assert.match(markdown, /^\| ref-bent \| BLOCKED \| — \| BLOCKED \|$/m);
  // An object at infinity records nothing, so no section has a table of recorded values.
  assert.ok(!markdown.includes("Recorded values, as each engine reports them."));
  assert.ok(model.sections.every((section) => section.recorded === null));

  // Twice over, the same bytes.
  const again = ladderRoot(t);
  await cycle(again);
  assert.equal(readFileSync(join(again, "runs", "ladder", REPORT_MARKDOWN_FILE), "utf8"), markdown);
});

// ── Every kind of mistranslation ─────────────────────────────────────────────────────────────────────────────────

function engineOf(options: BentOptions): EngineMaker {
  return (id) => new RemoteEngineAdapter({ id, transport: createInProcessTransport(createBentEngine(options)) });
}

const REF: EngineMaker = (id) =>
  new RemoteEngineAdapter({ id, transport: createInProcessTransport(createRefEngine()) });

/** The R0 and R1 pairs of `ref` against a copy with these edits, on one case. */
async function against(
  t: TestContext,
  opticalCase: OpticalCase,
  bend: Omit<BentOptions, "id">,
): Promise<{ r0: PairComparison; r1: PairComparison }> {
  const runsDir = tempDir(t);
  const { registry } = watchedRegistry({ ref: REF, "ref-bent": engineOf({ id: "ref-bent", ...bend }) });
  const suite = suiteOf("bends", [{ name: "one", opticalCase, rungs: ["r0", "r1"] }]);
  const { manifest } = await runSuite({ suite, registry, runsDir });
  assert.ok(
    manifest.jobs.every((job) => job.status === "ok"),
    JSON.stringify(manifest.jobs),
  );
  const file = compareManifest({
    manifest,
    store: createResultStore(join(runsDir, STORE_DIRECTORY)),
    policy: loadPolicy(),
    reference: "ref",
    modes: ["reference-vs-each"],
    cases: () => opticalCase,
  });
  const [r0, r1] = file.comparisons.map((set) => set.pairs[0]);
  assert.deepEqual(
    file.comparisons.map((set) => set.rung),
    ["r0", "r1"],
  );
  return { r0, r1 };
}

/** The first failing metric of a pair that the policy judges, as `name at where`. */
function firstCount(pair: PairComparison): string {
  const metric = pair.metrics.find((each) => each.name.endsWith(".mismatches") && each.value !== 0);
  return `${metric?.name} ${metric?.value} ${JSON.stringify(metric?.where)}`;
}

/** An asphere on a conic base, then a sphere, two lines: every member of a surface that an engine can get wrong. */
const ASPHERE = caseOf(
  [
    {
      z: 0,
      shape: {
        kind: "asphere",
        radius: 42.5,
        conic: -0.8,
        terms: [
          { power: 4, coeff: 1.2e-6 },
          { power: 5, coeff: -4.1e-8 },
          { power: 6, coeff: -3.4e-9 },
        ],
      },
      index: [1.5891, 1.5953],
      semiDiameter: 12,
    },
    { z: 6.5, shape: sphere(-180), index: [1, 1], semiDiameter: 11 },
    { z: 9, shape: sphere(Infinity), index: [1, 1], semiDiameter: 4 },
  ],
  { lines: 2, stopIndex: 2, stopSemiDiameter: 3.5, imageZ: 80 },
);

test("a faithful copy passes R0 and R1 without any difference", async (t) => {
  for (const opticalCase of [ASPHERE, DOUBLE_GAUSS]) {
    const { r0, r1 } = await against(t, opticalCase, {});
    assert.equal(r0.verdict, "PASS");
    assert.equal(r1.verdict, "PASS");
    for (const metric of [...r0.metrics, ...r1.metrics]) assert.equal(metric.value, 0, metric.name);
  }
});

test("each thing an engine can build wrong fails R0 with its field and its surface, and blocks R1", async (t) => {
  const tiny = 1 + 1e-12;
  const bends: [what: string, bend: Omit<BentOptions, "id">, expected: string][] = [
    // A vertex moved by 6.5e-12 mm: far inside the 1e-9 mm that a case's own invariant allows.
    [
      "vertex",
      { edits: [{ pointer: "/system/surfaces/1/z", scale: tiny }] },
      'layout.mismatches 1 {"field":"vertexZ","surface":1}',
    ],
    [
      "image plane",
      { edits: [{ pointer: "/conditions/imageZ", scale: tiny }] },
      'layout.mismatches 1 {"field":"imageZ"}',
    ],
    [
      "radius",
      { edits: [{ pointer: "/system/surfaces/0/shape/radius", scale: tiny }] },
      'shape.mismatches 1 {"field":"curvature","surface":0}',
    ],
    [
      "conic constant",
      { edits: [{ pointer: "/system/surfaces/0/shape/conic", scale: tiny }] },
      'shape.mismatches 1 {"field":"conic","surface":0}',
    ],
    [
      "odd coefficient",
      { edits: [{ pointer: "/system/surfaces/0/shape/terms/1/coeff", scale: tiny }] },
      'shape.mismatches 1 {"field":"terms","surface":0,"power":5}',
    ],
    [
      "coefficient of the wrong sign",
      { edits: [{ pointer: "/system/surfaces/0/shape/terms/2/coeff", scale: -1 }] },
      'shape.mismatches 1 {"field":"terms","surface":0,"power":6}',
    ],
    [
      "clip radius",
      { edits: [{ pointer: "/system/surfaces/1/aperture/semiDiameter", scale: tiny }] },
      'aperture.mismatches 1 {"field":"clipRadius","surface":1}',
    ],
    // Every radius the sag is given at scales with the nominal semi-diameter, but for the vertex.
    [
      "nominal semi-diameter",
      { edits: [{ pointer: "/system/surfaces/0/aperture/nominalSemiDiameter", scale: tiny }] },
      'aperture.mismatches 8 {"field":"sagRadii","surface":0,"sample":1}',
    ],
    [
      "stop radius",
      { edits: [{ pointer: "/conditions/stopSemiDiameter", scale: tiny }] },
      'aperture.mismatches 1 {"field":"stopSemiDiameter"}',
    ],
    [
      "index of the second line",
      { index: { line: 1, surface: 0, scale: tiny } },
      'index.mismatches 1 {"field":"indexAfterSurface","line":1,"surface":0}',
    ],
  ];
  for (const [what, bend, expected] of bends) {
    const { r0, r1 } = await against(t, ASPHERE, bend);
    assert.equal(r0.verdict, "FAIL", what);
    assert.equal(firstCount(r0), expected, what);
    assert.equal(r1.verdict, "BLOCKED", what);
    assert.equal(r1.reason, "not judged: rung r0 failed for ref and ref-bent on this case", what);
    assert.deepEqual(r1.metrics, [], what);
  }
});

test("what R0 lets through, R1 judges: without the blocking rule a wrong radius fails R1 by its own number", async (t) => {
  // The same wrong radius, judged by a policy whose R0 does not block: R1 says how far the focal length moved.
  const runsDir = tempDir(t);
  const bent = engineOf({ id: "ref-bent", edits: [{ pointer: "/system/surfaces/0/shape/radius", scale: 1 + 1e-6 }] });
  const { registry } = watchedRegistry({ ref: REF, "ref-bent": bent });
  const suite = suiteOf("bends", [{ name: "one", opticalCase: ASPHERE, rungs: ["r0", "r1"] }]);
  const { manifest } = await runSuite({ suite, registry, runsDir });
  const own = loadPolicy();
  const { blocksLaterRungs: _blocks, ...r0 } = own.rungs.r0;
  const policy = { ...own, rungs: { ...own.rungs, r0 } };
  const store = createResultStore(join(runsDir, STORE_DIRECTORY));
  const asked = { manifest, store, reference: "ref", modes: ["reference-vs-each"], cases: () => ASPHERE } as const;
  const file = compareManifest({ ...asked, policy });
  const [first, second] = file.comparisons.map((set) => set.pairs[0]);
  assert.equal(first.verdict, "FAIL");
  assert.equal(second.verdict, "FAIL");
  // A radius of 42.5 mm one part in 1e6 too long moves the focal point of this lens by some 1e-4 mm.
  const [metric] = second.metrics;
  assert.equal(metric.name, "firstOrder.maxAbs");
  assert.ok((metric.value ?? 0) > 1e-5 && (metric.value ?? 0) < 1e-3, String(metric.value));
  assert.equal(typeof metric.where?.quantity, "string");
  // With the comparator's own policy the same answers are blocked.
  const blocked = compareManifest({ ...asked, policy: own });
  assert.equal(blocked.comparisons[1].pairs[0].verdict, "BLOCKED");
  // Without the case of the run a rung that reads it cannot be judged, and says so: nothing is guessed.
  const { cases: _cases, ...withoutCases } = asked;
  const [, unjudged] = compareManifest({ ...withoutCases, policy }).comparisons.map((set) => set.pairs[0]);
  assert.deepEqual(
    [unjudged.verdict, unjudged.reason],
    ["ERROR", "the case is not at hand: a pupil is measured from its image plane"],
  );
});
