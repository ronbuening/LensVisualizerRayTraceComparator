import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test, type TestContext } from "node:test";

import { caseIdentity } from "../../src/contract/case.ts";
import type { OpticalCase } from "../../src/contract/case.ts";
import { expandSuite } from "../../src/contract/runSpec.ts";
import type { RunSpec, Suite } from "../../src/contract/runSpec.ts";
import { CONTRACT_VERSION } from "../../src/contract/version.ts";
import { REPO_ROOT } from "../../src/core/config.ts";
import { hashCanonical } from "../../src/core/numeric/hash.ts";
import { createFixtureCaseSource, loadSuite } from "../../src/core/suite.ts";
import type { CaseSource, LoadedSuite } from "../../src/core/suite.ts";
import { UsageError } from "../../src/core/usageError.ts";
import { FIXTURE_DIR, SUITE_WORKED, edited } from "../contract/corpus.ts";
import { DOUBLE_GAUSS, FAKE_PAIR_SUITE, FAKE_ROOT, SINGLET, caseFixture, tempDir } from "./support.ts";

const LV_PROBLEM = "no case source builds cases from LensVisualizer lenses";

/** A configuration root holding the given files; a string is written as it is, anything else as JSON. */
function rootWith(t: TestContext, files: Readonly<Record<string, unknown>> = {}): string {
  const rootDir = join(tempDir(t), "root");
  mkdirSync(rootDir);
  for (const [name, content] of Object.entries(files)) {
    mkdirSync(dirname(join(rootDir, name)), { recursive: true });
    writeFileSync(join(rootDir, name), typeof content === "string" ? content : JSON.stringify(content));
  }
  return rootDir;
}

function fixtureRun(name: string, path: string, options: Record<string, unknown> = {}): Record<string, unknown> {
  return { name, lens: { kind: "fixture", path }, ...options };
}

function suiteOf(runs: readonly unknown[], more: Record<string, unknown> = {}): Record<string, unknown> {
  return { contract: CONTRACT_VERSION, kind: "suite", name: "a-suite", runs, ...more };
}

/** Loads a suite written to `suite.json` in a root that holds the given files beside it. */
async function load(
  t: TestContext,
  suite: unknown,
  files: Readonly<Record<string, unknown>> = {},
): Promise<LoadedSuite> {
  const rootDir = rootWith(t, { "suite.json": suite, ...files });
  return loadSuite(join(rootDir, "suite.json"), { rootDir });
}

/** The `UsageError` a load must reject with. */
async function refused(loading: Promise<unknown>): Promise<UsageError> {
  const error = await loading.then(
    () => assert.fail("the suite loaded; expected a UsageError"),
    (reason: unknown) => reason,
  );
  assert.ok(error instanceof UsageError, String(error));
  return error;
}

// ── A suite that loads ───────────────────────────────────────────────────────────────────────────────────────────

test("the fixture suite loads: two runs, each with the case its lens names", async () => {
  const suite = await loadSuite(FAKE_PAIR_SUITE, { rootDir: FAKE_ROOT });
  assert.equal(suite.name, "fake-pair");
  assert.deepEqual(
    suite.runs.map((run) => [run.spec.name, run.opticalCase?.id, run.problems]),
    [
      ["singlet", SINGLET.id, []],
      ["double-gauss", DOUBLE_GAUSS.id, []],
    ],
  );
  assert.deepEqual(suite.runs[0].opticalCase, SINGLET);
  assert.deepEqual(suite.runs[1].opticalCase, DOUBLE_GAUSS);
  // The runs are complete RunSpecs: the suite's defaults are filled in.
  for (const run of suite.runs) {
    assert.equal(run.spec.kind, "run-spec");
    assert.equal(run.spec.contract, CONTRACT_VERSION);
    assert.deepEqual(run.spec.rungs, ["selftest"]);
  }
  assert.ok(
    Object.isFrozen(suite) && Object.isFrozen(suite.runs[0].spec) && Object.isFrozen(suite.runs[0].opticalCase),
  );
});

test("the hash is that of the suite's name and expanded runs, however the file words them", async (t) => {
  const worded: Suite = JSON.parse(readFileSync(FAKE_PAIR_SUITE, "utf8"));
  const fixture = await loadSuite(FAKE_PAIR_SUITE, { rootDir: FAKE_ROOT });
  assert.equal(fixture.hash, hashCanonical({ name: "fake-pair", runs: expandSuite(worded) }));
  assert.match(fixture.hash, /^[0-9a-f]{64}$/);

  // The same runs with the default written into each run, and the keys in another order.
  const path = "cases/singlet.json";
  const withDefaults = suiteOf([fixtureRun("one", path), fixtureRun("two", path)], {
    defaults: { rungs: ["selftest"] },
  });
  const spelledOut = {
    runs: [
      { rungs: ["selftest"], lens: { path, kind: "fixture" }, name: "one" },
      {
        name: "two",
        kind: "run-spec",
        lens: { kind: "fixture", path },
        rungs: ["selftest"],
        contract: CONTRACT_VERSION,
      },
    ],
    name: "a-suite",
    kind: "suite",
    contract: CONTRACT_VERSION,
  };
  const files = { [path]: SINGLET };
  const [a, b] = [await load(t, withDefaults, files), await load(t, spelledOut, files)];
  assert.equal(a.hash, b.hash);
  assert.deepEqual(a, b);

  // Another name, another option or another lens is another suite.
  const others = [
    suiteOf([fixtureRun("one", path), fixtureRun("two", path)], { defaults: { rungs: ["selftest"] }, name: "b-suite" }),
    suiteOf([fixtureRun("one", path), fixtureRun("two", path)]),
    suiteOf([fixtureRun("one", path), fixtureRun("three", path)], { defaults: { rungs: ["selftest"] } }),
  ];
  const hashes = [a.hash];
  for (const other of others) hashes.push((await load(t, other, files)).hash);
  assert.equal(new Set(hashes).size, 4);
});

test("a relative fixture path is resolved against the configuration root, wherever the suite file is", async (t) => {
  const rootDir = rootWith(t, { "cases/singlet.json": SINGLET });
  const elsewhere = join(tempDir(t), "suites", "elsewhere.json");
  mkdirSync(dirname(elsewhere));
  writeFileSync(elsewhere, JSON.stringify(suiteOf([fixtureRun("relative", "cases/singlet.json")])));
  const suite = await loadSuite(elsewhere, { rootDir });
  assert.deepEqual(suite.runs[0].problems, []);
  assert.equal(suite.runs[0].opticalCase?.id, SINGLET.id);
});

test("an absolute fixture path is used as it is", async (t) => {
  const suite = await load(t, suiteOf([fixtureRun("absolute", caseFixture("double-gauss"))]));
  assert.deepEqual(suite.runs[0].problems, []);
  assert.equal(suite.runs[0].opticalCase?.id, DOUBLE_GAUSS.id);
});

test("the contract's own worked example loads from the repository root: the fixture run has its case", async () => {
  const file = join(FIXTURE_DIR, "valid", "suite", "worked-example.json");
  const suite = await loadSuite(file, { rootDir: REPO_ROOT });
  assert.equal(suite.name, SUITE_WORKED.name);
  assert.deepEqual(
    suite.runs.map((run) => [run.spec.name, run.opticalCase?.id ?? null, run.problems]),
    [
      ["nikon-z-24-70f4s-wide", null, [LV_PROBLEM]],
      ["nikon-z-24-70f4s-tele", null, [LV_PROBLEM]],
      ["double-gauss", DOUBLE_GAUSS.id, []],
    ],
  );
});

// ── A file that is not a suite ───────────────────────────────────────────────────────────────────────────────────

test("a suite file that does not exist is a usage error naming the file", async (t) => {
  const file = join(tempDir(t), "no-such-suite.json");
  const error = await refused(loadSuite(file, { rootDir: REPO_ROOT }));
  assert.equal(error.message, `${file}: cannot be read (ENOENT)`);
});

test("a suite file that is a directory is a usage error naming the file", async (t) => {
  const directory = tempDir(t);
  assert.equal(
    (await refused(loadSuite(directory, { rootDir: directory }))).message,
    `${directory}: cannot be read (EISDIR)`,
  );
});

test("a suite file that is not JSON is a usage error naming the file", async (t) => {
  const rootDir = rootWith(t, { "suite.json": '{ "contract": "1.0", ' });
  const error = await refused(loadSuite(join(rootDir, "suite.json"), { rootDir }));
  assert.ok(error.message.startsWith(`${join(rootDir, "suite.json")}: malformed JSON (`), error.message);
});

test("a file that is not a valid suite is a usage error that says where it is not", async (t) => {
  const run = fixtureRun("one", "cases/singlet.json");
  const invalid: [suite: unknown, where: RegExp][] = [
    [suiteOf([]), /\/runs \[minItems\]/],
    [suiteOf([run], { name: "not a name" }), /\/name \[pattern\]/],
    [suiteOf([run], { kind: "run-spec" }), /\/kind \[const\]/],
    [suiteOf([run], { contract: "2.0" }), /\/contract \[pattern\]/],
    [suiteOf([{ name: "no-lens" }]), /\/runs\/0 \[required\]/],
    [suiteOf([run], { defaults: { lens: run.lens } }), /\/defaults\/lens \[additionalProperties\]/],
    [suiteOf([{ ...run, rungs: [] }]), /\/runs\/0\/rungs \[minItems\]/],
    [suiteOf([{ ...run, engines: ["Fake"] }]), /\/runs\/0\/engines\/0 \[pattern\]/],
    [{ ...SINGLET }, /\/kind \[const\]/],
    [[suiteOf([run])], /\(root\) \[type\]/],
  ];
  for (const [suite, where] of invalid) {
    const rootDir = rootWith(t, { "suite.json": suite });
    const error = await refused(loadSuite(join(rootDir, "suite.json"), { rootDir }));
    assert.ok(error.message.startsWith(`${join(rootDir, "suite.json")}: not a valid suite: `), error.message);
    assert.match(error.message, where);
  }
});

test("two runs of one name are a usage error naming the file and the name", async (t) => {
  const suite = suiteOf([fixtureRun("twice", "a.json"), fixtureRun("once", "a.json"), fixtureRun("twice", "b.json")]);
  const rootDir = rootWith(t, { "suite.json": suite });
  const error = await refused(loadSuite(join(rootDir, "suite.json"), { rootDir }));
  assert.equal(error.message, `${join(rootDir, "suite.json")}: suite a-suite: more than one run is named "twice"`);
});

// ── A run that cannot be run ─────────────────────────────────────────────────────────────────────────────────────

test("a LensVisualizer lens has no case without a source for it: that run says so, and the runs beside it load", async (t) => {
  const suite = await load(
    t,
    suiteOf([
      fixtureRun("before", "cases/singlet.json"),
      { name: "lv", lens: { kind: "lv", key: "nikkor-z50f12" }, state: { zoomT: 0 } },
      fixtureRun("after", "cases/gauss.json"),
    ]),
    { "cases/singlet.json": SINGLET, "cases/gauss.json": DOUBLE_GAUSS },
  );
  assert.deepEqual(
    suite.runs.map((run) => [run.spec.name, run.opticalCase?.id ?? null, run.problems]),
    [
      ["before", SINGLET.id, []],
      ["lv", null, [LV_PROBLEM]],
      ["after", DOUBLE_GAUSS.id, []],
    ],
  );
});

test("every way a fixture lens has no case is a problem of its run, and of no other", async (t) => {
  const moved = edited(SINGLET, "/system/surfaces/0/aperture/semiDiameter", 9) as OpticalCase;
  const movedIdentity = caseIdentity(moved.system, moved.conditions);
  assert.notEqual(movedIdentity.systemId, SINGLET.systemId);
  const flagged = edited(SINGLET, "/features", ["object.finite"]) as OpticalCase;
  const digest = "0".repeat(64);
  const files = {
    "cases/good.json": SINGLET,
    "cases/not-json.json": '{ "contract": ',
    "cases/a-request.json": { contract: CONTRACT_VERSION, kind: "request" },
    "cases/stop-as-string.json": edited(SINGLET, "/system/stopIndex", "0"),
    "cases/stop-out-of-range.json": edited(SINGLET, "/system/stopIndex", 2),
    "cases/two-broken.json": edited(edited(SINGLET, "/system/stopIndex", 2), "/system/designImageZ", 99),
    "cases/forged-table.json": edited(SINGLET, "/conditions/indexAfterSurface/$nd/sha256", digest),
    "cases/moved.json": moved,
    "cases/flagged.json": flagged,
    "cases/a-directory.json/inside.json": SINGLET,
  };
  const expected: [path: string, problems: (string | RegExp)[]][] = [
    ["cases/good.json", []],
    ["cases/missing.json", ["lens fixture cases/missing.json: it cannot be read (ENOENT)"]],
    ["cases/a-directory.json", ["lens fixture cases/a-directory.json: it cannot be read (EISDIR)"]],
    ["cases/not-json.json", ["lens fixture cases/not-json.json: it is malformed JSON"]],
    [
      "cases/a-request.json",
      [/^lens fixture cases\/a-request\.json: it is not a valid optical-case: .*\/kind \[const\]/],
    ],
    [
      "cases/stop-as-string.json",
      [
        "lens fixture cases/stop-as-string.json: it is not a valid optical-case: " +
          "/system/stopIndex [type] expected integer, got string",
      ],
    ],
    [
      "cases/stop-out-of-range.json",
      [
        "lens fixture cases/stop-out-of-range.json: it is not a valid optical-case: " +
          "system.stopIndex is 2, which is not the index of one of the 2 surfaces",
      ],
    ],
    ["cases/two-broken.json", [/system\.stopIndex is 2/, /system\.designImageZ is 99, but the thicknesses sum to 100/]],
    [
      "cases/forged-table.json",
      [/it is not a valid optical-case: conditions\.indexAfterSurface: ndarray: sha256 mismatch/],
    ],
    [
      "cases/moved.json",
      [
        `lens fixture cases/moved.json: it states the systemId ${SINGLET.systemId}, ` +
          `but its system and conditions give ${movedIdentity.systemId}`,
        `lens fixture cases/moved.json: it states the id ${SINGLET.id}, ` +
          `but its system and conditions give ${movedIdentity.id}`,
      ],
    ],
    [
      "cases/flagged.json",
      [
        'lens fixture cases/flagged.json: it states the features ["object.finite"], ' +
          "but its system and conditions give []",
      ],
    ],
  ];
  const runs = expected.map(([path], index) => fixtureRun(`run-${index}`, path));
  const rootDir = rootWith(t, { "suite.json": suiteOf(runs), ...files });
  const suite = await loadSuite(join(rootDir, "suite.json"), { rootDir });

  assert.equal(suite.runs.length, expected.length);
  suite.runs.forEach((run, index) => {
    const [path, problems] = expected[index];
    assert.equal(run.problems.length, problems.length, `${path}: ${run.problems.join(" | ")}`);
    problems.forEach((problem, at) => {
      if (typeof problem === "string") assert.equal(run.problems[at], problem);
      else assert.match(run.problems[at], problem);
    });
    assert.equal(run.opticalCase === null, problems.length > 0, path);
    // Problems are recorded in the manifest, so they name files relative to the root and never by where it is.
    for (const problem of run.problems) assert.ok(!problem.includes(rootDir), problem);
  });
  assert.equal(suite.runs[0].opticalCase?.id, SINGLET.id);
});

test("a fixture outside the root is named by its path from the root", async (t) => {
  const rootDir = rootWith(t);
  writeFileSync(
    join(rootDir, "suite.json"),
    JSON.stringify(suiteOf([fixtureRun("outside", "../shared/missing.json")])),
  );
  const suite = await loadSuite(join(rootDir, "suite.json"), { rootDir });
  assert.deepEqual(suite.runs[0].problems, ["lens fixture ../shared/missing.json: it cannot be read (ENOENT)"]);
});

test("explicit lines with the wrong number of weights are a problem of the run that states them", async (t) => {
  const lines = { kind: "explicit", wavelengthsNm: [656.2725, 587.5618, 486.1327], weights: [1, 2] };
  const suite = await load(
    t,
    suiteOf([
      fixtureRun("good", "cases/singlet.json"),
      fixtureRun("bad", "cases/singlet.json", { lines }),
      fixtureRun("also-good", "cases/singlet.json", { lines: { ...lines, weights: [1, 2, 1] } }),
    ]),
    { "cases/singlet.json": SINGLET },
  );
  assert.deepEqual(
    suite.runs.map((run) => [run.spec.name, run.opticalCase === null, run.problems]),
    [
      ["good", false, []],
      ["bad", true, ["lines states 2 weights for 3 wavelengths"]],
      ["also-good", false, []],
    ],
  );
});

test("a default that breaks the rule is a problem of every run that takes it, and of none other", async (t) => {
  const lines = { kind: "explicit", wavelengthsNm: [587.5618], weights: [1, 2] };
  const suite = await load(
    t,
    suiteOf(
      [
        fixtureRun("inherits", "cases/singlet.json"),
        fixtureRun("replaces", "cases/singlet.json", { lines: { kind: "reference" } }),
        fixtureRun("inherits-too", "cases/singlet.json"),
      ],
      { defaults: { lines } },
    ),
    { "cases/singlet.json": SINGLET },
  );
  assert.deepEqual(
    suite.runs.map((run) => run.problems),
    [["lines states 2 weights for 1 wavelengths"], [], ["lines states 2 weights for 1 wavelengths"]],
  );
});

test("a run with more than one thing wrong carries every problem", async (t) => {
  const lines = { kind: "explicit", wavelengthsNm: [587.5618], weights: [1, 2] };
  const suite = await load(
    t,
    suiteOf([
      fixtureRun("both", "cases/missing.json", { lines }),
      { name: "lv-both", lens: { kind: "lv", key: "some-lens" }, lines },
      fixtureRun("good", "cases/singlet.json"),
    ]),
    { "cases/singlet.json": SINGLET },
  );
  assert.deepEqual(suite.runs[0].problems, [
    "lines states 2 weights for 1 wavelengths",
    "lens fixture cases/missing.json: it cannot be read (ENOENT)",
  ]);
  assert.deepEqual(suite.runs[1].problems, ["lines states 2 weights for 1 wavelengths", LV_PROBLEM]);
  assert.deepEqual(suite.runs[2].problems, []);
  assert.deepEqual(
    suite.runs.map((run) => run.opticalCase === null),
    [true, true, false],
  );
});

// ── The case-source seam ─────────────────────────────────────────────────────────────────────────────────────────

test("a case source is asked once per run, with the whole RunSpec, and its case is the run's", async (t) => {
  const asked: RunSpec[] = [];
  const lv: CaseSource = {
    resolve: async (run) => {
      asked.push(run);
      return run.name === "tele"
        ? { ok: false, problems: ["no such zoom position"] }
        : { ok: true, opticalCase: DOUBLE_GAUSS };
    },
  };
  const rootDir = rootWith(t, {
    "suite.json": suiteOf(
      [
        { name: "wide", lens: { kind: "lv", key: "a-zoom" }, state: { zoomT: 0 } },
        { name: "tele", lens: { kind: "lv", key: "a-zoom" }, state: { zoomT: 1 } },
        fixtureRun("fixture", "cases/singlet.json"),
      ],
      { defaults: { aperture: { kind: "f-number", value: 8 } } },
    ),
    "cases/singlet.json": SINGLET,
  });
  const suite = await loadSuite(join(rootDir, "suite.json"), { rootDir, sources: { lv } });

  assert.deepEqual(
    asked.map((run) => [run.name, run.lens, run.state, run.aperture]),
    [
      ["wide", { kind: "lv", key: "a-zoom" }, { zoomT: 0 }, { kind: "f-number", value: 8 }],
      ["tele", { kind: "lv", key: "a-zoom" }, { zoomT: 1 }, { kind: "f-number", value: 8 }],
    ],
  );
  assert.deepEqual(
    suite.runs.map((run) => [run.opticalCase?.id ?? null, run.problems]),
    [
      [DOUBLE_GAUSS.id, []],
      [null, ["no such zoom position"]],
      // Sources were given, and none of them reads fixtures.
      [null, ["no case source reads optical-case files"]],
    ],
  );
});

test("a case source that rejects has crashed, and the load rejects with it", async (t) => {
  const lv: CaseSource = { resolve: () => Promise.reject(new Error("the binding broke")) };
  const rootDir = rootWith(t, { "suite.json": suiteOf([{ name: "lv", lens: { kind: "lv", key: "a-lens" } }]) });
  await assert.rejects(
    loadSuite(join(rootDir, "suite.json"), { rootDir, sources: { lv } }),
    /^Error: the binding broke$/,
  );
});

test("the fixture source reads a file once, and says so of a lens that is not a fixture", async (t) => {
  const rootDir = rootWith(t, { "cases/singlet.json": SINGLET });
  const source = createFixtureCaseSource(rootDir);
  const run = (name: string, lens: RunSpec["lens"]): RunSpec => ({
    contract: CONTRACT_VERSION,
    kind: "run-spec",
    name,
    lens,
  });
  const first = await source.resolve(run("first", { kind: "fixture", path: "cases/singlet.json" }));
  // The file is gone, and the source still has the case it read: a suite cannot see a file change under it.
  writeFileSync(join(rootDir, "cases", "singlet.json"), "{");
  const second = await source.resolve(run("second", { kind: "fixture", path: "./cases/../cases/singlet.json" }));
  assert.ok(first.ok && second.ok);
  assert.equal(first.opticalCase, second.opticalCase);

  assert.deepEqual(await source.resolve(run("lv", { kind: "lv", key: "a-lens" })), {
    ok: false,
    problems: ['a lens of kind "lv" is not a fixture'],
  });
});
