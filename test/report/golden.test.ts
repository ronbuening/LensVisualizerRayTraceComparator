// The Phase 0 benchmark: run -> compare -> report on the fixture suites gives the golden reports, and the same
// bytes every time, in any directory, whether the results were computed or found in the store.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import { REPO_ROOT } from "../../src/core/config.ts";
import { REPORT_MARKDOWN_FILE } from "../../src/report/index.ts";
import { FAKE_ROOT, tempDir } from "../core/support.ts";
import { PYTHON_MISSING } from "../engines/support.ts";
import { CYCLE_FILES, FAULT_ROOT, GOLDEN_SUITES, cycle, goldenFile } from "./support.ts";

for (const suite of GOLDEN_SUITES) {
  const skip = suite.needsPython ? PYTHON_MISSING : false;
  test(`${suite.name}: the report is the golden file, twice over and from the store`, { skip }, async (t) => {
    const first = join(tempDir(t), "runs");
    const second = join(tempDir(t), "elsewhere", "runs");
    const one = await cycle(suite, first);
    const two = await cycle(suite, second);
    for (const { steps } of [one, two]) {
      assert.deepEqual(
        steps.map((step) => step.code),
        suite.codes,
        steps.map((step) => step.out + step.err).join(""),
      );
    }
    assert.equal(
      one.files[REPORT_MARKDOWN_FILE],
      readFileSync(goldenFile(suite.name), "utf8"),
      "the report is not the golden file; if it is meant to change, run node test/report/writeGolden.ts",
    );

    // Two cycles into different directories: every file of the run directory is the same, byte for byte.
    for (const file of CYCLE_FILES) assert.equal(two.files[file], one.files[file], file);

    // A third cycle, into the first directory: nothing an engine answered is computed again, and nothing changes.
    const cached = await cycle(suite, first);
    assert.match(cached.steps[0].out, /\((\d+) computed, \d+ cached\)$/m);
    const computedAgain = Number(/\((\d+) computed, /.exec(cached.steps[0].out)?.[1]);
    const neverStored = (cached.steps[0].out.match(/ error {2,}computed /g) ?? []).length;
    assert.equal(computedAgain, neverStored, "only an error, which is never stored, is asked for again");
    for (const file of CYCLE_FILES) assert.equal(cached.files[file], one.files[file], file);

    // Nothing of the machine: no directory of this run, of the repository or of a fixture root, and no line ending
    // but LF. Each file ends in exactly one newline.
    for (const [file, text] of Object.entries(one.files)) {
      for (const absent of [first, second, REPO_ROOT, FAKE_ROOT, FAULT_ROOT, "/Users/", "/home/", "\r"]) {
        assert.ok(!text.includes(absent), `${file} holds ${JSON.stringify(absent)}`);
      }
      assert.ok(text.endsWith("\n") && !text.endsWith("\n\n"), file);
    }
  });
}

test("the benchmark trio is a TypeScript reference, the Python fake inside the tolerance and a fake without quantities", () => {
  // Read from the golden file, so the claim holds also where Python is missing and the suite is not run.
  const golden = readFileSync(goldenFile("fake-3-engines"), "utf8");
  assert.match(golden, /^\| fake-a \| available \| 1 \| [0-9a-f]{64} \|$/m);
  assert.match(golden, /^\| fake-pyn \| available \| 1 \| fake-pyn fixture 1 \|$/m);
  assert.match(golden, /^Reference vs each, against `fake-a`:$/m);
  // A PASS that is not zero: the two engines differ, and by less than the tolerance.
  assert.match(golden, /^\| fake-pyn \| 6\.04e-14 \| 2\.04e-14 at index 1 \| PASS \| {2}\|$/m);
  assert.match(
    golden,
    /^\| fake-none \| — \| — \| UNSUPPORTED \| fake-none is unsupported \(quantity selftest\.echo\) \|$/m,
  );
  assert.match(golden, /^\| fake-a \| — \| UNSUPPORTED \| PASS \(sum\.abs 6\.04e-14\) \|$/m);
  assert.match(golden, /^No pair is FAIL or ERROR, of 10 compared\.$/m);
});

test("the Python trio and the all-TypeScript trio report the same numbers", () => {
  // The rows of the reference-vs-each tables for the engine with the small bias, under one name.
  const numbers = (name: string): string[] =>
    readFileSync(goldenFile(name), "utf8")
      .split("\n")
      .filter((line) => /^\| (fake-pyn|fake-near) \| [0-9]/.test(line))
      .map((line) => line.replace(/fake-pyn|fake-near/, "near"));
  assert.deepEqual(numbers("fake-3-engines"), numbers("fake-3-engines-ts"));
  assert.equal(numbers("fake-3-engines").length, 2);
});

test("the faults report shows a FAIL beyond tolerance, an engine error, an unavailable engine and a run not started", () => {
  const golden = readFileSync(goldenFile("fake-faults"), "utf8");
  assert.match(golden, /^18 of 18 pairs are FAIL or ERROR\.$/m);
  assert.match(golden, /^\| fake-absent \| unavailable: load-failed \| — \| — \|$/m);
  assert.match(golden, /^\| singlet \| selftest \| ok \| error: load-failed \| error: protocol-error \| ok \|$/m);
  assert.match(
    golden,
    /^\| fake-far \| 3\.00e-3 \| 1\.00e-3 at index 1 \| FAIL \| sum\.abs 3\.00e-3 exceeds its tolerance 1\.00e-12; /m,
  );
  assert.match(golden, /^\| fake-broken \| — \| — \| ERROR \| fake-broken ended as error \(protocol-error\) \|$/m);
  assert.match(
    golden,
    /^\| missing \| — \| not started: lens fixture cases\/missing\.json: it cannot be read \(ENOENT\) \|$/m,
  );
  // The suite names no reference: the first engine with an ok result is it.
  assert.match(golden, /^Reference vs each, against `fake-a`:$/m);
});
