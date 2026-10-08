// `lvrtc mtf` against the fake LV tree: the command line, the record it writes and the table it prints,
// hermetically. The fake's "MTF tab" and "product MTF" are its own, and their numbers describe no real lens.
import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test, type TestContext } from "node:test";

import { createMtfCommand } from "../../src/cli/commands/mtf.ts";
import { COMMANDS, EXIT_FAILURE, EXIT_OK, EXIT_USAGE, runCli } from "../../src/cli/main.ts";
import { verifyCaseIdentity } from "../../src/contract/case.ts";
import type { OpticalCase } from "../../src/contract/case.ts";
import type { MtfNativeData, MtfNativeSpec } from "../../src/contract/quantities/mtfNative.ts";
import { validateKind } from "../../src/contract/schemas.ts";
import { CONTRACT_VERSION } from "../../src/contract/version.ts";
import { CONFIG_FILE } from "../../src/core/config.ts";
import { MTF_RUN_FILE, mtfRunText } from "../../src/core/mtfRun.ts";
import type { MtfRun } from "../../src/core/mtfRun.ts";
import { canonicalJson } from "../../src/core/numeric/canonicalJson.ts";
import { resultDataProblems } from "../../src/core/resultData.ts";
import { adapterRevision } from "../../src/engines/adapterRevision.ts";
import { LV_ENGINE_MODULE } from "../../src/engines/lv/engine.ts";
import { mtfNativeQuantity } from "../../src/quantities/mtfNative.ts";
import { mtfTableText } from "../../src/report/mtfTable.ts";
import {
  FAKE_ENGINE_FILES,
  FAKE_LENS_FILES,
  closeBinding,
  closureOf,
  freshLv,
  variantOf,
} from "../engines/lv/support.ts";

const [SINGLET_FILE, ZOOM_FILE] = FAKE_LENS_FILES.map(([file]) => file);

interface Run {
  readonly code: number;
  readonly out: string;
  readonly err: string;
}

/** A configuration root whose `lvPath` is a fresh copy of the fake LV tree; it goes when the tree does. */
function freshRoot(t: TestContext): { rootDir: string; lv: string; runsDir: string } {
  const lv = freshLv(t);
  const rootDir = dirname(lv);
  writeFileSync(join(rootDir, CONFIG_FILE), JSON.stringify({ lvPath: "lv" }));
  return { rootDir, lv, runsDir: join(rootDir, "runs") };
}

/** Runs `lvrtc mtf` through the real dispatcher, writing runs into the root. */
async function mtf(args: readonly string[], rootDir: string): Promise<Run> {
  const out: string[] = [];
  const err: string[] = [];
  const command = createMtfCommand({ rootDir, env: { LVRTC_RUNS_DIR: join(rootDir, "runs") }, cwd: rootDir });
  const code = await runCli(
    ["mtf", ...args],
    { stdout: (text) => void out.push(text), stderr: (text) => void err.push(text) },
    [command],
  );
  return { code, out: out.join(""), err: err.join("") };
}

/**
 * Points the root at another tree beside its own, runs `body`, and closes the binding the command made of that
 * tree, so that the next tree can be bound: the loader serves one LensVisualizer at a time.
 */
async function onTree(rootDir: string, tree: string, body: () => Promise<void>): Promise<void> {
  writeFileSync(join(rootDir, CONFIG_FILE), JSON.stringify({ lvPath: tree }));
  try {
    await body();
  } finally {
    await closeBinding(join(rootDir, tree));
  }
}

/** The record of a run of the default profile, read back from the runs directory. */
function recordOf(runsDir: string, name: string): { record: MtfRun; text: string; directory: string } {
  const directory = join(runsDir, "mtf", "lv-tab-default", name);
  const text = readFileSync(join(directory, MTF_RUN_FILE), "utf8");
  return { record: JSON.parse(text), text, directory };
}

const USAGE = [
  "Usage: lvrtc mtf <lensKey> [--engines <id,...>] [--profile <name>] [--zoom <t>]",
  "                 [--aperture wide-open|f/8] [--root <dir>] [--json]",
  "",
].join("\n");

test("mtf is a registered command, and --help prints the usage and loads nothing", async (t) => {
  assert.ok(COMMANDS.some((command) => command.name === "mtf"));
  const rootDir = mkdtempSync(join(tmpdir(), "lvrtc-mtf-"));
  t.after(() => rmSync(rootDir, { recursive: true, force: true }));
  const help = await mtf(["--help"], rootDir);
  assert.equal(help.code, EXIT_OK);
  assert.ok(help.out.startsWith(USAGE));
  assert.match(help.out, /--profile <name> {2}the request to make \(default: lv-tab-default\)/);
  assert.equal(help.err, "");
});

test("the tab's request for a lens: a table per engine, and the request, the case and the answer on disk", async (t) => {
  const { rootDir, lv, runsDir } = freshRoot(t);
  const run = await mtf(["acme-zoom-24-48", "--zoom", "1"], rootDir);
  assert.equal(run.code, EXIT_OK, run.err);
  assert.equal(run.err, "");

  const { record, text, directory } = recordOf(runsDir, "acme-zoom-24-48-zoom1");
  assert.equal(text, mtfRunText(record), "the record is canonical JSON and a newline");
  assert.deepEqual(Object.keys(record), [
    "answers",
    "caseId",
    "contract",
    "displayedFrequenciesPerMm",
    "engines",
    "kind",
    "lensKey",
    "name",
    "profile",
    "request",
  ]);
  assert.deepEqual(
    [record.contract, record.kind, record.name, record.lensKey, record.profile],
    [CONTRACT_VERSION, "mtf-run", "acme-zoom-24-48-zoom1", "acme-zoom-24-48", "lv-tab-default"],
  );
  // The request is the fake tab's: its fields at 25 % steps, the six frequencies it computes, two of them shown.
  assert.deepEqual(validateKind("request", record.request), []);
  assert.equal(record.request.quantity, "mtf.native");
  const spec = record.request.spec as MtfNativeSpec;
  assert.deepEqual(spec, {
    frequenciesPerMm: [0, 10, 20, 30, 40, 50],
    fields: { kind: "image-height-fractions", values: [0, 0.25, 0.5, 0.75, 1] },
    method: "diffraction",
    focus: "engine-best",
    profile: "lv-tab-default",
  });
  assert.deepEqual(record.displayedFrequenciesPerMm, [20, 40]);
  assert.deepEqual(record.engines, [
    {
      id: "lv",
      status: "available",
      version: "1",
      fingerprint: closureOf(lv, FAKE_ENGINE_FILES),
      adapterRevision: adapterRevision(LV_ENGINE_MODULE).revision,
      details: { commit: null, dirty: null, engineFileCount: FAKE_ENGINE_FILES.length },
    },
  ]);

  // The case is kept beside the record, by its id, and is the lens at the zoom position on the tab's lines.
  assert.deepEqual(readdirSync(join(directory, "cases")), [`${record.caseId}.json`]);
  const caseText = readFileSync(join(directory, "cases", `${record.caseId}.json`), "utf8");
  const opticalCase: OpticalCase = JSON.parse(caseText);
  assert.equal(caseText, `${canonicalJson(opticalCase)}\n`);
  assert.deepEqual(verifyCaseIdentity(opticalCase), []);
  assert.equal(record.request.caseId, opticalCase.id);
  assert.deepEqual([opticalCase.label.lensKey, opticalCase.label.zoomT], ["acme-zoom-24-48", 1]);
  assert.equal(opticalCase.conditions.lines.length, 5);
  assert.equal(opticalCase.conditions.stopSemiDiameter, 6);

  // The answer is kept whole, and is also in the result store, under the key the record names.
  const [answer] = record.answers;
  assert.deepEqual([record.answers.length, answer.engine, answer.status], [1, "lv", "ok"]);
  assert.deepEqual(validateKind("result", answer.result), []);
  assert.deepEqual(resultDataProblems(mtfNativeQuantity, answer.result?.data), []);
  assert.ok(existsSync(join(runsDir, "store", `${answer.storeKey}.json`)));
  const data = answer.result?.data as MtfNativeData;
  assert.deepEqual(data.method.params.displayedFrequenciesPerMm, [20, 40]);

  const file = join(directory, MTF_RUN_FILE);
  assert.equal(
    run.out,
    [
      "acme-zoom-24-48  ACME Zoom 24-48mm f/4",
      "profile  lv-tab-default: the tab as it opens, wide open at f/4",
      "state    zoom 1, infinity focus",
      `case     ${record.caseId}`,
      `request  ${record.request.id}`,
      "",
      "lv  ok  computed",
      mtfTableText({ spec, data, displayedFrequenciesPerMm: [20, 40], opticalCase }),
      `result: ${file}`,
      "",
    ].join("\n"),
  );
  // The fake's curves fall straight to 32 cycles/mm a millimetre of stop, lowered with the field: at the full field
  // 20 cycles/mm is (1 - 20 / 192) x 0.75 in the sagittal cut and that times 0.75 again in the tangential.
  assert.match(run.out, /^field {2}height mm {2}angle deg {2}status {4}S 20 {4}T 20 {4}S 40 {4}T 40$/m);
  assert.match(run.out, /^1 {9}10\.000 {5}20\.000 {2}ok {6}0\.6719 {2}0\.5039 {2}0\.5938 {2}0\.4453$/m);
  assert.match(run.out, /^focus {5}best-axial, shift -0\.0469 mm$/m);
  assert.match(run.out, /^aperture {2}traced f\/[0-9.]+, limited by surface STO, the stop$/m);
  assert.match(run.out, /^lines {5}555 nm \(1\), /m);

  // Asked again, the answer comes from the store, and the record is the same bytes.
  const again = await mtf(["acme-zoom-24-48", "--zoom=1"], rootDir);
  assert.equal(again.code, EXIT_OK, again.err);
  assert.equal(again.out, run.out.replace("lv  ok  computed", "lv  ok  cached"));
  assert.equal(readFileSync(file, "utf8"), text);
  // Nothing of this machine or of the moment is in what is written.
  for (const absent of [rootDir, "computed", "cached"]) assert.ok(!text.includes(absent), absent);
});

test("--aperture f/8 is the tab's own comparison: another case, another run, the same request", async (t) => {
  const { rootDir, runsDir } = freshRoot(t);
  const wideOpen = await mtf(["acme-zoom-24-48"], rootDir);
  const comparison = await mtf(["acme-zoom-24-48", "--aperture", "f/8"], rootDir);
  assert.deepEqual([wideOpen.code, comparison.code], [EXIT_OK, EXIT_OK], comparison.err);
  assert.match(comparison.out, /^profile {2}lv-tab-default: the tab's comparison at f\/8$/m);
  const [open, stopped] = [recordOf(runsDir, "acme-zoom-24-48"), recordOf(runsDir, "acme-zoom-24-48-f8")];
  assert.deepEqual(stopped.record.request.spec, open.record.request.spec);
  assert.notEqual(stopped.record.caseId, open.record.caseId);
  const params = (stopped.record.answers[0].result?.data as MtfNativeData).method.params;
  // The fake zoom is f/4 with an iris of 3 mm at its wide end: the comparison traces 3 x 4 / 8.
  assert.deepEqual([params.view, params.fNumber, params.stopSemiDiameterMm], ["f8-comparison", 8, 1.5]);
  // --aperture wide-open is the default.
  assert.equal(
    (await mtf(["acme-zoom-24-48", "--aperture", "wide-open"], rootDir)).out.split("\n")[3],
    wideOpen.out.split("\n")[3],
  );
});

test("a comparison the tab does not offer is said to be none, also where its case is the wide-open one", async (t) => {
  const { rootDir, lv, runsDir } = freshRoot(t);
  const said = (reason: string) =>
    `profile  lv-tab-default: the tab's comparison at f/8, which the tab does not offer here: ${reason}`;

  // A lens that is f/8 wide open is scaled by 8 / 8: its comparison is the very case of the lens wide open, which
  // the engine answers as that. The command does not call it a comparison the tab makes.
  variantOf(lv, "at-eight", { [ZOOM_FILE]: (text) => text.replace('"fopen": 4,', '"fopen": 8,') });
  await onTree(rootDir, "at-eight", async () => {
    const wideOpen = await mtf(["acme-zoom-24-48"], rootDir);
    const comparison = await mtf(["acme-zoom-24-48", "--aperture", "f/8"], rootDir);
    assert.deepEqual([wideOpen.code, comparison.code], [EXIT_OK, EXIT_OK], comparison.err);
    const reason =
      "the lens is at f/8 wide open, and LensVisualizer's MTF tab compares with f/8 only a lens that is faster " +
      "than f/7.95";
    assert.equal(comparison.out.split("\n")[1], said(reason));
    const [open, stopped] = [recordOf(runsDir, "acme-zoom-24-48"), recordOf(runsDir, "acme-zoom-24-48-f8")];
    assert.equal(stopped.record.caseId, open.record.caseId);
    assert.match(comparison.out, /^lv {2}ok {2}cached$/m);
    const params = (stopped.record.answers[0].result?.data as MtfNativeData).method.params;
    assert.deepEqual([params.view, params.fNumber], ["wide-open", 8]);
  });

  // A slower lens has a case of its own for the comparison, and the engine says the same as the command.
  variantOf(lv, "slow", { [ZOOM_FILE]: (text) => text.replace('"fopen": 4,', '"fopen": 11,') });
  await onTree(rootDir, "slow", async () => {
    const comparison = await mtf(["acme-zoom-24-48", "--aperture", "f/8"], rootDir);
    assert.equal(comparison.code, EXIT_OK, comparison.err);
    const reason =
      "the lens is at f/11 wide open, and LensVisualizer's MTF tab compares with f/8 only a lens that is faster " +
      "than f/7.95";
    assert.equal(comparison.out.split("\n")[1], said(reason));
    assert.ok(comparison.out.includes(`lv  unsupported  computed\n  feature aperture.f8-comparison: ${reason}\n`));
  });
});

test("every named engine is asked the one request; one that does not offer the quantity is not asked", async (t) => {
  const { rootDir, runsDir } = freshRoot(t);
  const run = await mtf(["acme-singlet-50", "--engines", "ref,lv"], rootDir);
  assert.equal(run.code, EXIT_OK, run.err);
  assert.match(run.out, /^lv {2}ok {2}computed$/m);
  assert.match(
    run.out,
    /^ref {2}unsupported {2}negotiated\n {2}quantity mtf\.native: the engine does not offer mtf\.native$/m,
  );
  const { record } = recordOf(runsDir, "acme-singlet-50");
  assert.deepEqual(
    record.engines.map((engine) => engine.id),
    ["lv", "ref"],
  );
  assert.deepEqual(
    record.answers.map(({ engine, status, storeKey }) => [engine, status, storeKey === null]),
    [
      ["lv", "ok", false],
      ["ref", "unsupported", true],
    ],
  );
});

test("--json prints the record with its file, how each answer was come by and the fields as numbers", async (t) => {
  const { rootDir, runsDir } = freshRoot(t);
  const run = await mtf(["acme-singlet-50", "--json"], rootDir);
  assert.equal(run.code, EXIT_OK, run.err);
  const printed = JSON.parse(run.out);
  const { record, directory } = recordOf(runsDir, "acme-singlet-50");
  const { file, sources, tables, ...rest } = printed;
  assert.deepEqual(rest, record);
  assert.equal(file, join(directory, MTF_RUN_FILE));
  assert.deepEqual(sources, { lv: "computed" });
  // The fake singlet's iris is 6.25 mm: its curve at 20 cycles/mm on the axis is 1 - 20 / 200.
  assert.deepEqual(tables.lv[0], {
    field: 0,
    imageHeightMm: 0,
    fieldAngleDeg: 0,
    status: "ok",
    sagittal: [0.9, 0.8],
    tangential: [0.9, 0.8],
  });
  assert.equal(tables.lv.length, 5);
});

test("a lens LensVisualizer shows no MTF for is answered as its gate does; a lens without a case has none", async (t) => {
  const { rootDir, lv, runsDir } = freshRoot(t);
  variantOf(lv, "unverified", {
    [SINGLET_FILE]: (text) => text.replace("focusTravel: 5,", "focusTravel: 5,\n  unverifiedScale: true,"),
  });
  await onTree(rootDir, "unverified", async () => {
    const refused = await mtf(["acme-singlet-50"], rootDir);
    assert.equal(refused.code, EXIT_OK, refused.err);
    assert.match(
      refused.out,
      /^lv {2}unsupported {2}computed\n {2}feature unverified-scale: Prescription scale needs verification before reporting lp\/mm\.$/m,
    );
    const { record } = recordOf(runsDir, "acme-singlet-50");
    assert.deepEqual(
      record.answers.map(({ status, result }) => [status, result?.unsupported?.[0].item]),
      [["unsupported", "unverified-scale"]],
    );
    // An "unsupported" is an answer: it is stored, and found again.
    assert.match((await mtf(["acme-singlet-50"], rootDir)).out, /^lv {2}unsupported {2}cached$/m);
  });

  variantOf(lv, "folded", {
    "src/optics/compat.ts": (text) => text.replace("isFoldedOptics: false", "isFoldedOptics: true"),
  });
  await onTree(rootDir, "folded", async () => {
    const folded = await mtf(["acme-zoom-24-48"], rootDir);
    assert.equal(folded.code, EXIT_FAILURE);
    assert.equal(folded.out, "");
    assert.match(folded.err, /^lvrtc mtf: acme-zoom-24-48: folded-path: /);
    assert.ok(!existsSync(join(runsDir, "mtf", "lv-tab-default", "acme-zoom-24-48")));
  });
});

test("an engine that fails is an error of the run: its code is recorded, and its words are only printed", async (t) => {
  const { rootDir, lv, runsDir } = freshRoot(t);
  variantOf(lv, "broken", {
    "src/optics/analysis/mtf.ts": (text) =>
      text.replace('status: unsettled ? "unconverged" : "converged"', 'status: "pending"'),
  });
  await onTree(rootDir, "broken", async () => {
    const run = await mtf(["acme-singlet-50"], rootDir);
    assert.equal(run.code, EXIT_FAILURE);
    assert.match(run.out, /^lv {2}error {2}computed\n {2}engine-failure: LensVisualizer left the field 0 pending$/m);
    const { record, text } = recordOf(runsDir, "acme-singlet-50");
    assert.deepEqual(record.answers, [
      { engine: "lv", status: "error", storeKey: null, error: { code: "engine-failure" } },
    ]);
    assert.ok(!text.includes("pending"));
  });
});

test("a command line that is not the synopsis is a usage error, and nothing is written", async (t) => {
  const { rootDir, runsDir } = freshRoot(t);
  const usage = async (args: readonly string[], message: string) => {
    const run = await mtf(args, rootDir);
    assert.equal(run.code, EXIT_USAGE, `${args.join(" ")}: ${run.err}`);
    assert.equal(run.out, "");
    assert.equal(run.err, `lvrtc mtf: ${message}\n${USAGE}`);
  };
  await usage([], "no lens key was given");
  await usage(["acme-singlet-50", "acme-zoom-24-48"], 'unexpected argument "acme-zoom-24-48"');
  await usage(["acme-singlet-50", "--focus", "1"], 'unknown option "--focus"');
  await usage(["acme-singlet-50", "--zoom", "2"], '--zoom needs a number from 0 to 1, got "2"');
  await usage(["acme-singlet-50", "--engines", "lv,"], '--engines needs ids separated by commas, got "lv,"');
  await usage(
    ["acme-singlet-50", "--profile", "zemax-default"],
    'unknown profile "zemax-default": the profiles are lv-tab-default',
  );
  await usage(
    ["acme-singlet-50", "--engines", "lv,optiland"],
    'unknown engine "optiland": the configuration defines no engine; built in: lv, ref',
  );
  await usage(["acme-singlet-50", "--root", "no-such-root"], "--root no-such-root: not a directory");
  // The tab reaches any other aperture only through its slider: the profile has no request for one.
  const slider =
    "the profile lv-tab-default is LensVisualizer's MTF tab as it opens: --aperture takes wide-open or f/8 with it";
  await usage(["acme-singlet-50", "--aperture", "f/5.6"], slider);
  await usage(["acme-singlet-50", "--aperture", "r=3"], slider);
  await usage(
    ["acme-singlet-50", "--aperture", "f8"],
    '--aperture needs wide-open, f/<N> or r=<mm> with a positive number, got "f8"',
  );
  await usage(["acme-singlet-51"], 'unknown lens "acme-singlet-51"; did you mean acme-singlet-50?');
  assert.ok(!existsSync(runsDir));
});

test("without a LensVisualizer the command fails and says which", async (t) => {
  const rootDir = mkdtempSync(join(tmpdir(), "lvrtc-mtf-"));
  t.after(() => rmSync(rootDir, { recursive: true, force: true }));
  const run = await mtf(["acme-singlet-50"], rootDir);
  assert.equal(run.code, EXIT_FAILURE);
  assert.match(run.err, /^lvrtc mtf: LensVisualizer is not configured: set lvPath /);
  assert.equal(run.out, "");
});
