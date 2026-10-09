// Rung R4 from end to end, without LensVisualizer: the reference engine against a faithful copy of itself and
// against a copy that was handed another radius, on the probe rays of a lens of two lines, at its design plane and
// at a shifted one. The copies are the test-only engine of test/engines/ref/bentEngine.ts. What is held here is
// the plumbing: a field's sets at every line are compared as one, under the first of them; what the closed forms
// of the MTF are is test/compare/raysMtf.test.ts.
import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { test, type TestContext } from "node:test";
import { fileURLToPath } from "node:url";

import { createCompareCommand } from "../../src/cli/commands/compare.ts";
import { createReportCommand } from "../../src/cli/commands/report.ts";
import { createRunCommand } from "../../src/cli/commands/run.ts";
import { EXIT_FAILURE, EXIT_OK, runCli } from "../../src/cli/main.ts";
import { COMPARISONS_FILE } from "../../src/compare/comparisonFile.ts";
import type { ComparisonFile } from "../../src/compare/comparisonFile.ts";
import { finalizeCase } from "../../src/contract/case.ts";
import type { ComparisonSet } from "../../src/contract/comparison.ts";
import { CONTRACT_VERSION } from "../../src/contract/version.ts";
import { CONFIG_FILE } from "../../src/core/config.ts";
import { MANIFEST_FILE } from "../../src/core/manifest.ts";
import type { RunManifest } from "../../src/core/manifest.ts";
import { REPORT_MARKDOWN_FILE } from "../../src/report/index.ts";
import { LENS } from "../compare/raysSupport.ts";
import { tempDir } from "../core/support.ts";
import type { BentOptions } from "../engines/ref/bentEngine.ts";

const BENT_ENGINE = fileURLToPath(new URL("../engines/ref/bentEngine.ts", import.meta.url));
const FAKE_ENGINE = fileURLToPath(new URL("../../src/engines/fake/engine.ts", import.meta.url));

/** How far behind its design plane the image plane of the run `shifted` lies, mm. */
const SHIFT = 0.25;

/**
 * A root with a faithful copy of the reference engine, a copy that holds the first radius one part in ten thousand
 * too long, and two engines that trace no rays; and a suite of the support's lens of two lines, as it is and with
 * its image plane moved, on two fields.
 */
function ladderRoot(t: TestContext): string {
  const rootDir = join(tempDir(t), "root");
  const bent: BentOptions = {
    id: "ref-bent",
    edits: [{ pointer: "/system/surfaces/0/shape/radius", scale: 1 + 1e-4 }],
  };
  const fake = (id: string) => ({ transport: "in-process", module: FAKE_ENGINE, options: { id } });
  const config = {
    engines: {
      "ref-bent": { transport: "in-process", module: BENT_ENGINE, options: bent },
      "ref-twin": { transport: "in-process", module: BENT_ENGINE, options: { id: "ref-twin" } },
      "fake-a": fake("fake-a"),
      "fake-b": fake("fake-b"),
    },
  };
  const suite = {
    contract: CONTRACT_VERSION,
    kind: "suite",
    name: "mtf",
    defaults: {
      engines: ["ref", "ref-bent", "ref-twin", "fake-a"],
      referenceEngine: "ref",
      rungs: ["r4"],
      fields: { kind: "angles-deg", values: [0, 3] },
      sampling: { bundleGrid: 12 },
    },
    runs: [
      { name: "design", lens: { kind: "fixture", path: "cases/lens.json" } },
      { name: "shifted", lens: { kind: "fixture", path: "cases/shifted.json" }, frequenciesPerMm: [40, 5] },
    ],
  };
  const { label, system, conditions, provenance } = LENS;
  const shifted = finalizeCase({
    label,
    system,
    conditions: { ...conditions, imageZ: conditions.imageZ + SHIFT },
    provenance,
  });
  mkdirSync(join(rootDir, "cases"), { recursive: true });
  writeFileSync(join(rootDir, CONFIG_FILE), JSON.stringify(config));
  writeFileSync(join(rootDir, "suite.json"), JSON.stringify(suite));
  writeFileSync(join(rootDir, "cases", "lens.json"), JSON.stringify(LENS));
  writeFileSync(join(rootDir, "cases", "shifted.json"), JSON.stringify(shifted));
  return rootDir;
}

async function lvrtc(rootDir: string, ...args: string[]): Promise<{ code: number; out: string; err: string }> {
  const inputs = { rootDir, cwd: rootDir, env: {} };
  const commands = [createRunCommand(inputs), createCompareCommand(inputs), createReportCommand(inputs)];
  const out: string[] = [];
  const err: string[] = [];
  const io = { stdout: (text: string) => void out.push(text), stderr: (text: string) => void err.push(text) };
  return { code: await runCli(args, io, commands), out: out.join(""), err: err.join("") };
}

function read<T>(rootDir: string, file: string): T {
  return JSON.parse(readFileSync(join(rootDir, "runs", "mtf", file), "utf8")) as T;
}

test("R4 compares a field at every line as one set: a faithful copy differs by nothing, and another radius fails", async (t) => {
  const rootDir = ladderRoot(t);
  const ran = await lvrtc(rootDir, "run", "suite.json");
  assert.equal(ran.code, EXIT_OK, ran.err);
  // Two runs, two fields, two lines: eight ray sets, asked of four engines, of which one traces no rays.
  assert.match(ran.out, /^mtf: 32 jobs: 24 ok, 8 unsupported, 0 error, 0 pending \(24 computed, 0 cached\)$/m);
  const manifest = read<RunManifest>(rootDir, MANIFEST_FILE);
  // The recipe of each run is recorded: the plane of its case, and its frequencies in ascending order.
  const [design, shifted] = manifest.runs;
  assert.deepEqual(design.recipe?.recipe?.plane, { kind: "design", shiftMm: 0 });
  assert.deepEqual(design.recipe?.recipe?.frequenciesPerMm, [10, 30, 50]);
  assert.deepEqual(shifted.recipe?.recipe?.plane, { kind: "shift", shiftMm: SHIFT });
  assert.deepEqual(shifted.recipe?.recipe?.frequenciesPerMm, [5, 40]);
  assert.equal(shifted.recipe?.recipe?.imageZ, LENS.conditions.imageZ + SHIFT);

  const compared = await lvrtc(rootDir, "compare", "mtf");
  assert.equal(compared.code, EXIT_FAILURE, compared.out);
  // A set for each field of each run, in each mode: three pairs against the reference and six pairwise.
  assert.match(
    compared.out,
    /^mtf: 36 pairs: 8 PASS, 0 FLOOR, 12 FAIL, 0 RECORDED, 0 ATTENTION, 16 UNSUPPORTED, 0 BLOCKED, 0 ERROR$/m,
  );
  const file = read<ComparisonFile>(rootDir, COMPARISONS_FILE);
  assert.ok(file.comparisons.every((set) => set.rung === "r4" && set.quantity === "rays.trace"));
  const sets = (run: string, mode: string): ComparisonSet[] =>
    file.comparisons.filter((set) => set.run === run && set.mode === mode);

  for (const run of ["design", "shifted"]) {
    // The requests of a run are its fields, and for each field its lines: a set is under the first line's.
    const requests = [...new Set(manifest.jobs.filter((job) => job.run === run).map((job) => job.requestId))];
    assert.equal(requests.length, 4);
    for (const mode of ["reference-vs-each", "pairwise"]) {
      assert.deepEqual(
        sets(run, mode).map((set) => set.requestId),
        [requests[0], requests[2]],
        `${run} ${mode}`,
      );
    }
    for (const [index, set] of sets(run, "reference-vs-each").entries()) {
      assert.deepEqual(
        set.participants.map((participant) => `${participant.engine} ${participant.status}`),
        ["fake-a unsupported", "ref ok", "ref-bent ok", "ref-twin ok"],
      );
      const [none, bent, twin] = set.pairs;
      assert.deepEqual([none.b, none.verdict, none.metrics], ["fake-a", "UNSUPPORTED", []]);
      assert.equal(none.reason, "fake-a is unsupported (quantity rays.trace)");

      // The faithful copy is the same arithmetic on the same rays: the two curves are the same bits.
      assert.deepEqual([twin.b, twin.verdict, twin.reason], ["ref-twin", "PASS", undefined]);
      const of = (name: string) => twin.metrics.find((metric) => metric.name === name);
      const frequencyPerMm = run === "design" ? 10 : 5;
      assert.deepEqual(of("mtf.maxAbs"), {
        name: "mtf.maxAbs",
        value: 0,
        unit: "1",
        where: { field: [0, 3][index], cut: "sagittal", frequencyPerMm },
      });
      assert.deepEqual(of("lines.compared"), { name: "lines.compared", value: 2, unit: "lines" });
      assert.deepEqual(of("rays.dropped"), { name: "rays.dropped", value: 0, unit: "rays" });
      // A twelve-by-twelve lattice at two lines, of which the stop passes the middle.
      const count = of("rays.compared")?.value ?? 0;
      assert.ok(count >= 8 && count < 288 && count % 2 === 0, String(count));

      // Another radius is another focus: the rays land elsewhere, and the MTF of them is another.
      assert.deepEqual([bent.b, bent.verdict], ["ref-bent", "FAIL"]);
      assert.match(
        bent.reason ?? "",
        /^mtf\.maxAbs \S+ exceeds its tolerance 1\.00e-7 at cut \w+, field \d, frequencyPerMm \d+$/,
      );
      assert.ok((bent.metrics[0].value ?? 0) > 1e-7);
      assert.ok((run === "design" ? [10, 30, 50] : [5, 40]).includes(bent.metrics[0].where?.frequencyPerMm as number));
    }
  }
  // The plane of a run is its case's: the same rays on another plane give another difference.
  const worst = (run: string): (number | null)[] =>
    sets(run, "reference-vs-each").map((set) => set.pairs[1].metrics[0].value);
  assert.notDeepEqual(worst("design"), worst("shifted"));

  const reported = await lvrtc(rootDir, "report", "mtf");
  assert.equal(reported.code, EXIT_OK, reported.err);
  const markdown = readFileSync(join(rootDir, "runs", "mtf", REPORT_MARKDOWN_FILE), "utf8");
  assert.match(markdown, /^#### r4, request 1 of 4$/m);
  assert.match(markdown, /^#### r4, request 3 of 4$/m);
  assert.doesNotMatch(markdown, /^#### r4, request 2 of 4$/m);
  assert.match(markdown, /^Quantity `rays\.trace`, compared identical-rays, gated\. /m);
  assert.match(
    markdown,
    /^\| Engine \| mtf\.maxAbs \(≤ 1\.00e-7\) \| rays\.compared \[rays\] \| rays\.dropped \[rays\] \| lines\.compared \[lines\] \| Verdict \| Note \|$/m,
  );
  assert.match(
    markdown,
    /^\| ref-twin \| 0 at cut sagittal, field 0, frequencyPerMm 10 \| \d+ \| 0 \| 2 \| PASS \| {2}\|$/m,
  );

  // The rungs of traced rays ask the same requests: with R2 and R3 beside it, R4 finds every answer in the store.
  const all = await lvrtc(rootDir, "run", "suite.json", "--rungs", "r2,r3,r4", "--engines", "ref,ref-twin");
  assert.equal(all.code, EXIT_OK, all.err);
  assert.match(all.out, /^mtf: 48 jobs: 48 ok, 0 unsupported, 0 error, 0 pending \(0 computed, 48 cached\)$/m);
  const again = await lvrtc(rootDir, "compare", "mtf");
  assert.equal(again.code, EXIT_OK, again.out);
  // R2 and R3 judge each ray set, R4 each field: 8 + 8 + 4 sets, each of one pair in each mode.
  assert.match(again.out, /^mtf: 40 pairs: 40 PASS, 0 FLOOR, 0 FAIL, /m);
});

test("a field no engine traced has no span to be put in: each of its requests stands alone, unsupported", async (t) => {
  const rootDir = ladderRoot(t);
  const ran = await lvrtc(rootDir, "run", "suite.json", "--engines", "fake-a,fake-b");
  assert.equal(ran.code, EXIT_OK, ran.err);
  assert.match(ran.out, /^mtf: 16 jobs: 0 ok, 16 unsupported, 0 error, 0 pending/m);
  const compared = await lvrtc(rootDir, "compare", "mtf", "--reference", "fake-a");
  assert.equal(compared.code, EXIT_OK, compared.out);
  // Eight requests, one pair in each mode: nothing says which of them are of one field.
  assert.match(compared.out, /^mtf: 16 pairs: 0 PASS, 0 FLOOR, 0 FAIL, 0 RECORDED, 0 ATTENTION, 16 UNSUPPORTED, /m);
  const file = read<ComparisonFile>(rootDir, COMPARISONS_FILE);
  assert.equal(new Set(file.comparisons.map((set) => set.requestId)).size, 8);
});
