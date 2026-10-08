// `lvrtc export` against the fake LV tree: the command line, the case it writes and the census, hermetically.
import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test, type TestContext } from "node:test";

import { createExportCommand } from "../../src/cli/commands/export.ts";
import { COMMANDS, EXIT_FAILURE, EXIT_OK, EXIT_USAGE, runCli } from "../../src/cli/main.ts";
import { caseInvariantProblems, verifyCaseIdentity } from "../../src/contract/case.ts";
import type { OpticalCase } from "../../src/contract/case.ts";
import { FEATURE_FLAGS } from "../../src/contract/features.ts";
import { validateKind } from "../../src/contract/schemas.ts";
import { CONTRACT_VERSION } from "../../src/contract/version.ts";
import { CONFIG_FILE } from "../../src/core/config.ts";
import { canonicalJson } from "../../src/core/numeric/canonicalJson.ts";
import { CENSUS_FILES, renderCensusMarkdown } from "../../src/engines/lv/census.ts";
import type { ExportCensus } from "../../src/engines/lv/census.ts";
import { FAKE_ENGINE_FILES, closureOf, freshLv } from "../engines/lv/support.ts";

interface Run {
  readonly code: number;
  readonly out: string;
  readonly err: string;
}

/** A configuration root whose `lvPath` is a fresh copy of the fake LV tree; it goes when the tree does. */
function freshRoot(t: TestContext): { rootDir: string; lv: string } {
  const lv = freshLv(t);
  const rootDir = dirname(lv);
  writeFileSync(join(rootDir, CONFIG_FILE), JSON.stringify({ lvPath: "lv" }));
  return { rootDir, lv };
}

/** Runs `lvrtc export` through the real dispatcher. */
async function exportCli(args: readonly string[], inputs: { rootDir: string; cwd?: string }): Promise<Run> {
  const out: string[] = [];
  const err: string[] = [];
  const command = createExportCommand({ rootDir: inputs.rootDir, env: {}, cwd: inputs.cwd ?? inputs.rootDir });
  const code = await runCli(
    ["export", ...args],
    { stdout: (text) => void out.push(text), stderr: (text) => void err.push(text) },
    [command],
  );
  return { code, out: out.join(""), err: err.join("") };
}

/** What a zoom that is exported without a zoom position is told, and a prime that is given one. */
const TELE_HINT =
  "lvrtc export: acme-zoom-24-48 is a zoom lens: this is its wide end (zoom 0); --zoom 1 gives the tele end\n";
const PRIME_NOTE = "lvrtc export: acme-singlet-50 is a prime: it has no zoom position, and --zoom is ignored\n";

/** The case a successful export printed, checked to be one; `said` is what the error stream is to hold. */
function printedCase(run: Run, said: string = ""): OpticalCase {
  assert.equal(run.code, EXIT_OK, run.err);
  assert.equal(run.err, said);
  const opticalCase: OpticalCase = JSON.parse(run.out);
  assert.equal(run.out, `${canonicalJson(opticalCase)}\n`, "the case is canonical JSON and a newline");
  assert.deepEqual(validateKind("optical-case", opticalCase), []);
  assert.deepEqual(caseInvariantProblems(opticalCase.system, opticalCase.conditions), []);
  assert.deepEqual(verifyCaseIdentity(opticalCase), []);
  return opticalCase;
}

const USAGE = [
  "Usage: lvrtc export <lensKey> [--zoom <t>] [--focus <t>] [--aperture wide-open|f/<N>|r=<mm>]",
  "                    [--lines reference|cdf|photopic] [--out <file>] [--root <dir>]",
  "       lvrtc export --all [--census <dir>] [--json] [--root <dir>]",
  "",
].join("\n");

test("export is a registered command", () => {
  assert.ok(COMMANDS.some((command) => command.name === "export"));
});

// ── One lens ─────────────────────────────────────────────────────────────────────────────────────────────────────

test("a lens key prints the case of the lens at its default state: canonical JSON, valid, with its identity", async (t) => {
  const { rootDir } = freshRoot(t);
  const opticalCase = printedCase(await exportCli(["acme-singlet-50"], { rootDir }));
  assert.equal(opticalCase.contract, CONTRACT_VERSION);
  assert.deepEqual(opticalCase.label, { name: "ACME Singlet 50mm f/4", lensKey: "acme-singlet-50", focusT: 0 });
  assert.equal(opticalCase.system.surfaces.length, 3);
  assert.deepEqual(opticalCase.conditions.object, { kind: "infinity" });
  assert.equal(opticalCase.conditions.stopSemiDiameter, 6.25);
  assert.equal(opticalCase.conditions.imageZ, opticalCase.system.designImageZ);
  assert.deepEqual(opticalCase.conditions.lines, [{ wavelengthNm: 587.5618, weight: 1, indexSource: "authored" }]);
  // The same command line gives the same bytes.
  assert.equal((await exportCli(["acme-singlet-50"], { rootDir })).out, `${canonicalJson(opticalCase)}\n`);
});

test("--zoom, --aperture and --lines choose the state, the stop and the light", async (t) => {
  const { rootDir } = freshRoot(t);
  const args = ["acme-zoom-24-48", "--zoom", "1", "--aperture", "f/8", "--lines=photopic"];
  const opticalCase = printedCase(await exportCli(args, { rootDir }));
  assert.equal(opticalCase.label.zoomT, 1);
  assert.equal(opticalCase.conditions.stopSemiDiameter, (6 * 4) / 8);
  assert.equal(opticalCase.conditions.lines.length, 5);
  assert.equal(opticalCase.conditions.lines[0].wavelengthNm, 555);

  const byRadius = printedCase(
    await exportCli(["acme-zoom-24-48", "--aperture", "r=1.25", "--lines", "cdf"], { rootDir }),
    TELE_HINT,
  );
  assert.equal(byRadius.conditions.stopSemiDiameter, 1.25);
  assert.equal(byRadius.system.surfaces[2].aperture.nominalSemiDiameter, 1.25);
  assert.equal(byRadius.conditions.lines.length, 3);
  const wideOpen = printedCase(await exportCli(["acme-zoom-24-48", "--aperture", "wide-open"], { rootDir }), TELE_HINT);
  assert.equal(wideOpen.id, printedCase(await exportCli(["acme-zoom-24-48"], { rootDir }), TELE_HINT).id);
});

test("one lens is one state: a zoom without --zoom is its wide end and is told of the tele end; a prime has no position", async (t) => {
  const { rootDir } = freshRoot(t);
  // A zoom: the wide end by default, with the hint; a position that is named is exported without a word.
  const byDefault = printedCase(await exportCli(["acme-zoom-24-48"], { rootDir }), TELE_HINT);
  assert.equal(byDefault.label.zoomT, 0);
  const wide = printedCase(await exportCli(["acme-zoom-24-48", "--zoom", "0"], { rootDir }));
  assert.deepEqual(wide, byDefault);
  const tele = printedCase(await exportCli(["acme-zoom-24-48", "--zoom", "1"], { rootDir }));
  assert.equal(tele.label.zoomT, 1);
  assert.notEqual(tele.id, wide.id);

  // A prime: no hint, and a position given to it is ignored and said to be: the same case, bytes and all.
  const prime = await exportCli(["acme-singlet-50"], { rootDir });
  const positioned = await exportCli(["acme-singlet-50", "--zoom", "0.5"], { rootDir });
  printedCase(prime);
  assert.equal(printedCase(positioned, PRIME_NOTE).provenance.source.kind, "lv-lens");
  assert.equal(positioned.out, prime.out);
  assert.equal((await exportCli(["acme-singlet-50", "--zoom", "0"], { rootDir })).err, "");
});

test("--focus exports a certified station with its finite object, and no other focus position", async (t) => {
  const { rootDir } = freshRoot(t);
  const closest = printedCase(await exportCli(["acme-singlet-50", "--focus", "1"], { rootDir }));
  assert.deepEqual(closest.conditions.object, { kind: "finite", z: -500 });
  assert.equal(closest.label.focusT, 1);

  const between = await exportCli(["acme-singlet-50", "--focus", "0.5"], { rootDir });
  assert.equal(between.code, EXIT_FAILURE);
  assert.equal(between.out, "");
  assert.equal(
    between.err,
    "lvrtc export: acme-singlet-50: finite-conjugate-unavailable: focus position 0.5 at zoom 0 is not a station " +
      "whose object distance LensVisualizer certifies; only infinity focus and its documented stations can be exported\n",
  );
  // Focus position 0 is infinity focus.
  const atZero = printedCase(await exportCli(["acme-singlet-50", "--focus", "0"], { rootDir }));
  assert.deepEqual(atZero.conditions.object, { kind: "infinity" });
});

test("a lens that cannot be exported as asked exits 1 with every reason and its code, and prints no case", async (t) => {
  const { rootDir } = freshRoot(t);
  const fast = await exportCli(["acme-zoom-24-48", "--aperture", "f/2"], { rootDir });
  assert.equal(fast.code, EXIT_FAILURE);
  assert.equal(fast.out, "");
  assert.equal(
    fast.err,
    `${TELE_HINT}lvrtc export: acme-zoom-24-48: aperture-faster-than-wide-open: f/2 is faster than the lens's ` +
      "widest aperture at zoom 0, f/4\n",
  );
  const noData = await exportCli(["zenith-doublet-100", "--lines", "photopic", "--aperture", "f/1"], { rootDir });
  assert.equal(noData.code, EXIT_FAILURE);
  assert.deepEqual(
    noData.err
      .trimEnd()
      .split("\n")
      .map((line) => line.split(": ").slice(0, 3).join(": ")),
    [
      "lvrtc export: zenith-doublet-100: aperture-faster-than-wide-open",
      "lvrtc export: zenith-doublet-100: spectral-data-unavailable",
    ],
  );
});

test("--out writes the case to a file relative to the working directory, and prints nothing", async (t) => {
  const { rootDir } = freshRoot(t);
  const cwd = mkdtempSync(join(tmpdir(), "lvrtc-export-"));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));
  const printed = await exportCli(["acme-singlet-50"], { rootDir });
  const written = await exportCli(["acme-singlet-50", "--out", "cases/singlet.json"], { rootDir, cwd });
  assert.deepEqual([written.code, written.out, written.err], [EXIT_OK, "", ""]);
  assert.equal(readFileSync(join(cwd, "cases", "singlet.json"), "utf8"), printed.out);
  // A lens that cannot be exported writes no file.
  const refused = await exportCli(["acme-zoom-24-48", "--aperture", "f/2", "--out", "cases/no.json"], { rootDir, cwd });
  assert.equal(refused.code, EXIT_FAILURE);
  assert.deepEqual(readdirSync(join(cwd, "cases")), ["singlet.json"]);
});

// ── Every lens ───────────────────────────────────────────────────────────────────────────────────────────────────

/** The summary of the fake tree: three lenses, one of them a zoom. */
const SUMMARY = [
  "3 lenses (1 of them zooms, each at both ends), 4 states: 4 exported, 0 not exportable, 0 threw",
  "  primes       2: 2 exported, 0 not exportable, 0 threw",
  "  zooms, wide  1: 1 exported, 0 not exportable, 0 threw",
  "  zooms, tele  1: 1 exported, 0 not exportable, 0 threw",
  "",
].join("\n");

test("--all exports every lens, the zoom at both ends, and prints what became of each state", async (t) => {
  const { rootDir } = freshRoot(t);
  const run = await exportCli(["--all"], { rootDir });
  assert.deepEqual([run.code, run.err], [EXIT_OK, ""]);
  assert.equal(run.out, SUMMARY);
});

test("--all --json prints the census: counts, hashes and lens keys, and nothing of a surface", async (t) => {
  const { rootDir, lv } = freshRoot(t);
  const run = await exportCli(["--all", "--json"], { rootDir });
  assert.equal(run.code, EXIT_OK, run.err);
  const census: ExportCensus = JSON.parse(run.out);
  assert.equal(run.out, `${JSON.stringify(census, null, 2)}\n`);
  assert.deepEqual(census, {
    byState: {
      prime: { exported: 2, notExportable: 0, states: 2, threw: 0 },
      tele: { exported: 1, notExportable: 0, states: 1, threw: 0 },
      wide: { exported: 1, notExportable: 0, states: 1, threw: 0 },
    },
    contract: CONTRACT_VERSION,
    // Three lenses in four states: the zoom is exported at both ends.
    exported: 4,
    features: {
      ...Object.fromEntries(FEATURE_FLAGS.map((flag) => [flag, 0])),
      "surface.asphere.even": 2,
      "surface.conic": 2,
    },
    kind: "lv-export-census",
    lensVisualizer: {
      commit: null,
      dirty: null,
      engineClosureHash: closureOf(lv, FAKE_ENGINE_FILES),
      engineFileCount: FAKE_ENGINE_FILES.length,
    },
    lenses: 3,
    limits: {
      "asphere.maxPower": { end: "wide", lens: "acme-zoom-24-48", max: 4 },
      "lines.count": { lens: "acme-singlet-50", max: 1 },
      "surfaces.count": { end: "wide", lens: "acme-zoom-24-48", max: 7 },
    },
    notExportable: 0,
    notes: {},
    reasons: {},
    request: { aperture: "wide-open", focus: "infinity", imagePlane: "design", lines: "reference", zoom: "both-ends" },
    states: 4,
    threw: [],
    unindexedFiles: 0,
    zooms: 1,
  });
  // No number of a prescription: no radius, gap or index of the fake lenses is in the text.
  for (const absent of ["47.5", "1.52", "-80", "6.25"]) assert.ok(!run.out.includes(absent), absent);
});

test("--census writes the census as JSON and Markdown, the same bytes every time", async (t) => {
  const { rootDir } = freshRoot(t);
  const first = await exportCli(["--all", "--census", "census/a"], { rootDir });
  assert.equal(first.code, EXIT_OK, first.err);
  const directory = join(rootDir, "census", "a");
  assert.equal(
    first.out,
    `${SUMMARY}` + `census: ${join(directory, CENSUS_FILES.json)}, ${join(directory, CENSUS_FILES.markdown)}\n`,
  );
  assert.deepEqual(readdirSync(directory).sort(), ["lv-export.json", "lv-export.md"]);
  const json = readFileSync(join(directory, CENSUS_FILES.json), "utf8");
  const markdown = readFileSync(join(directory, CENSUS_FILES.markdown), "utf8");
  assert.equal(json, (await exportCli(["--all", "--json"], { rootDir })).out);
  assert.equal(markdown, renderCensusMarkdown(JSON.parse(json)));
  assert.match(markdown, /^# LensVisualizer export census\n/);
  assert.match(markdown, /^3 lenses, 1 of them zooms, in 4 states; 0 lens files not indexed\.$/m);
  assert.match(markdown, /^\| Zooms, tele end \| 1 \| 1 \| 0 \| 0 \|$/m);
  assert.match(markdown, /^\| All \| 4 \| 4 \| 0 \| 0 \|$/m);

  const second = await exportCli(["--all", "--census", join(rootDir, "census", "b"), "--json"], { rootDir });
  assert.equal(second.out, json, "with --json the census is printed, and no line beside it");
  for (const name of Object.values(CENSUS_FILES)) {
    assert.equal(readFileSync(join(rootDir, "census", "b", name), "utf8"), readFileSync(join(directory, name), "utf8"));
  }
  // Neither file says where or when it was written.
  for (const absent of [rootDir, tmpdir()]) {
    assert.ok(!json.includes(absent) && !markdown.includes(absent), absent);
  }
  const dateOrTime = /[0-9]{4}-[0-9]{2}-[0-9]{2}|[0-9]{2}:[0-9]{2}:[0-9]{2}/;
  assert.ok(!dateOrTime.test(json) && !dateOrTime.test(markdown));
});

test("--all counts a lens that cannot be exported under each of its reasons, and one that cannot be built", async (t) => {
  const { rootDir, lv } = freshRoot(t);
  mkdirSync(join(lv, "src/lens-data/broken"));
  writeFileSync(
    join(lv, "src/lens-data/broken/NoStop.data.ts"),
    'export default { key: "no-stop", name: "No stop", surfaces: [{ label: "1", R: 50, d: 4, nd: 1.5, sd: 8 }] };\n',
  );
  const run = await exportCli(["--all", "--json"], { rootDir });
  assert.equal(run.code, EXIT_OK, run.err);
  const census: ExportCensus = JSON.parse(run.out);
  assert.deepEqual([census.lenses, census.states, census.exported, census.notExportable], [4, 5, 4, 1]);
  assert.deepEqual(census.threw, []);
  assert.deepEqual(census.reasons, {
    "lens-build-failed": { states: 1, lenses: ["no-stop"], wideOnly: [], teleOnly: [] },
  });
  const text = await exportCli(["--all"], { rootDir });
  assert.equal(
    text.out,
    [
      "4 lenses (1 of them zooms, each at both ends), 5 states: 4 exported, 1 not exportable, 0 threw",
      "  primes       3: 2 exported, 1 not exportable, 0 threw",
      "  zooms, wide  1: 1 exported, 0 not exportable, 0 threw",
      "  zooms, tele  1: 1 exported, 0 not exportable, 0 threw",
      "not exportable, by reason (states, lenses):",
      "  lens-build-failed  1  1",
      "",
    ].join("\n"),
  );
});

test("--all names a lens file it cannot index and exits 1, with the census of the others", async (t) => {
  const { rootDir, lv } = freshRoot(t);
  writeFileSync(join(lv, "src/lens-data/acme/Keyless.data.ts"), "export default { name: 'No key' };\n");
  const run = await exportCli(["--all", "--json"], { rootDir });
  assert.equal(run.code, EXIT_FAILURE);
  assert.equal(run.err, "lvrtc export: src/lens-data/acme/Keyless.data.ts: no string key\n");
  const census: ExportCensus = JSON.parse(run.out);
  assert.deepEqual([census.lenses, census.states, census.exported, census.unindexedFiles], [3, 4, 4, 1]);
});

// ── The command line ─────────────────────────────────────────────────────────────────────────────────────────────

test("a command line that is not the synopsis is a usage error, and LensVisualizer is not loaded for it", async (t) => {
  // A root without a configuration: anything that loaded LensVisualizer would fail otherwise.
  const rootDir = mkdtempSync(join(tmpdir(), "lvrtc-export-"));
  t.after(() => rmSync(rootDir, { recursive: true, force: true }));
  const cases: [string[], string][] = [
    [[], "no lens key was given, and no --all"],
    [["a", "b"], 'unexpected argument "b"'],
    [["--all", "a"], 'unexpected argument "a"'],
    [["a", "--zoom", "2"], '--zoom needs a number from 0 to 1, got "2"'],
    [["a", "--focus", "near"], '--focus needs a number from 0 to 1, got "near"'],
    [["a", "--aperture", "f8"], '--aperture needs wide-open, f/<N> or r=<mm> with a positive number, got "f8"'],
    [["a", "--aperture", "f/0"], '--aperture needs wide-open, f/<N> or r=<mm> with a positive number, got "f/0"'],
    [["a", "--aperture", "r=-1"], '--aperture needs wide-open, f/<N> or r=<mm> with a positive number, got "r=-1"'],
    [["a", "--aperture", "r="], '--aperture needs wide-open, f/<N> or r=<mm> with a positive number, got "r="'],
    [["a", "--aperture"], "--aperture needs a value"],
    [["a", "--lines", "rgb"], '--lines needs one of reference, cdf, photopic, got "rgb"'],
    [["a", "--census", "dir"], "--census needs --all"],
    [["a", "--json"], "--json needs --all"],
    [["--all", "--zoom", "1"], "--zoom cannot be used with --all"],
    [["--all", "--out", "x.json"], "--out cannot be used with --all"],
    [["--all", "--lines", "cdf"], "--lines cannot be used with --all"],
    [["a", "--root", "no-such-dir"], "--root no-such-dir: not a directory"],
    [["a", "--frequencies", "10"], 'unknown option "--frequencies"'],
  ];
  for (const [args, message] of cases) {
    const run = await exportCli(args, { rootDir });
    assert.deepEqual(
      [run.code, run.out, run.err],
      [EXIT_USAGE, "", `lvrtc export: ${message}\n${USAGE}`],
      args.join(" "),
    );
  }
});

test("a key that is not in the catalog is a usage error that suggests the nearest keys", async (t) => {
  const { rootDir } = freshRoot(t);
  const run = await exportCli(["acme-singlet"], { rootDir });
  assert.equal(run.code, EXIT_USAGE);
  assert.equal(run.err, `lvrtc export: unknown lens "acme-singlet"; did you mean acme-singlet-50?\n${USAGE}`);
});

test("a LensVisualizer that is not configured is a failure that says so", async (t) => {
  const rootDir = mkdtempSync(join(tmpdir(), "lvrtc-export-"));
  t.after(() => rmSync(rootDir, { recursive: true, force: true }));
  for (const args of [["acme-singlet-50"], ["--all"]]) {
    const run = await exportCli(args, { rootDir });
    assert.equal(run.code, EXIT_FAILURE);
    assert.equal(run.out, "");
    assert.match(run.err, /^lvrtc export: LensVisualizer is not configured: set lvPath /);
  }
});

test("--help prints the usage and loads nothing", async (t) => {
  const rootDir = mkdtempSync(join(tmpdir(), "lvrtc-export-"));
  t.after(() => rmSync(rootDir, { recursive: true, force: true }));
  const run = await exportCli(["--help"], { rootDir });
  assert.equal(run.code, EXIT_OK);
  assert.ok(run.out.startsWith(USAGE));
  assert.equal(run.err, "");
  assert.equal(existsSync(join(rootDir, "runs")), false);
});
