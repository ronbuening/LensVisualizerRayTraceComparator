import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test, type TestContext } from "node:test";

import { createLensesCommand } from "../../src/cli/commands/lenses.ts";
import { COMMANDS, EXIT_FAILURE, EXIT_OK, EXIT_USAGE, runCli } from "../../src/cli/main.ts";
import { CONFIG_FILE } from "../../src/core/config.ts";
import { FAKE_LENS_FILES, fileHash, freshLv } from "../engines/lv/support.ts";

interface Run {
  readonly code: number;
  readonly out: string;
  readonly err: string;
}

/**
 * A configuration root whose `lvPath` is a fresh copy of the fake LV tree. The root is the tree's parent directory,
 * so it goes when the tree does.
 */
function freshRoot(t: TestContext, config?: unknown): { rootDir: string; lv: string } {
  const lv = freshLv(t);
  const rootDir = dirname(lv);
  writeFileSync(join(rootDir, CONFIG_FILE), JSON.stringify(config ?? { lvPath: "lv" }));
  return { rootDir, lv };
}

/** Runs `lvrtc lenses` through the real dispatcher. */
async function lenses(
  args: readonly string[],
  inputs: { rootDir: string; cwd?: string; env?: Record<string, string> },
): Promise<Run> {
  const out: string[] = [];
  const err: string[] = [];
  const command = createLensesCommand({
    rootDir: inputs.rootDir,
    env: inputs.env ?? {},
    cwd: inputs.cwd ?? inputs.rootDir,
  });
  const code = await runCli(
    ["lenses", ...args],
    { stdout: (text) => void out.push(text), stderr: (text) => void err.push(text) },
    [command],
  );
  return { code, out: out.join(""), err: err.join("") };
}

const USAGE = [
  "Usage: lvrtc lenses list [--root <dir>] [--json]",
  "       lvrtc lenses show <key> [--zoom <t>] [--focus <t>] [--root <dir>] [--json]",
  "",
].join("\n");

test("lenses is a registered command", () => {
  assert.ok(COMMANDS.some((command) => command.name === "lenses"));
});

test("list prints the count, then key, name and file of each lens, sorted by key", async (t) => {
  const { rootDir } = freshRoot(t);
  const run = await lenses(["list"], { rootDir });
  assert.equal(run.code, EXIT_OK);
  assert.equal(run.err, "");
  assert.equal(
    run.out,
    [
      "3 lenses",
      "acme-singlet-50     ACME Singlet 50mm f/4     src/lens-data/acme/AcmeSinglet50.data.ts",
      "acme-zoom-24-48     ACME Zoom 24-48mm f/4     src/lens-data/acme/AcmeZoom2448.data.ts",
      "zenith-doublet-100  ZENITH Doublet 100mm f/8  src/lens-data/zenith/ZenithDoublet100.data.ts",
      "",
    ].join("\n"),
  );
});

test("list --json prints one object with the hash of each lens file", async (t) => {
  const { rootDir, lv } = freshRoot(t);
  const run = await lenses(["list", "--json"], { rootDir });
  assert.equal(run.code, EXIT_OK);
  const report = JSON.parse(run.out);
  assert.deepEqual(Object.keys(report), ["count", "fileCount", "lenses", "problems"]);
  assert.equal(report.count, 3);
  assert.equal(report.fileCount, 3);
  assert.deepEqual(report.problems, []);
  assert.deepEqual(report.lenses[1], {
    file: FAKE_LENS_FILES[1][0],
    fileSha256: fileHash(lv, FAKE_LENS_FILES[1][0]),
    key: "acme-zoom-24-48",
    name: "ACME Zoom 24-48mm f/4",
    zoom: true,
  });
});

test("list names the lens files it could not index and exits 1", async (t) => {
  const { rootDir, lv } = freshRoot(t);
  writeFileSync(join(lv, "src/lens-data/acme/Copy.data.ts"), 'export default { key: "acme-zoom-24-48", name: "C" };\n');
  writeFileSync(join(lv, "src/lens-data/acme/NoKey.data.ts"), "export default {};\n");
  const run = await lenses(["list"], { rootDir });
  assert.equal(run.code, EXIT_FAILURE);
  assert.match(run.out, /^2 lenses\nacme-singlet-50 .*\nzenith-doublet-100 .*\n$/);
  assert.equal(
    run.err,
    [
      'lvrtc lenses: src/lens-data/acme/AcmeZoom2448.data.ts: duplicate key "acme-zoom-24-48" (also in src/lens-data/acme/Copy.data.ts)',
      'lvrtc lenses: src/lens-data/acme/Copy.data.ts: duplicate key "acme-zoom-24-48" (also in src/lens-data/acme/AcmeZoom2448.data.ts)',
      "lvrtc lenses: src/lens-data/acme/NoKey.data.ts: no string key",
      "",
    ].join("\n"),
  );
});

test("show prints the prepared state: surfaces, stop, last lens surface and image plane", async (t) => {
  const { rootDir } = freshRoot(t);
  const run = await lenses(["show", "acme-zoom-24-48", "--zoom", "0.5", "--focus", "1"], { rootDir });
  assert.equal(run.code, EXIT_OK);
  assert.equal(run.err, "");
  assert.equal(
    run.out,
    [
      "acme-zoom-24-48  ACME Zoom 24-48mm f/4",
      "file   src/lens-data/acme/AcmeZoom2448.data.ts",
      "focus  1",
      "zoom   0.5",
      "",
      "#  label     R    d   nd   sd     z  asphere  synthetic",
      "0  1        40    8  1.6    9     0  no",
      "1  2A      -80    2    1    9     8  yes",
      "2  STO    flat    2    1  4.5    10  no",
      "3  4        60    3  1.7    7    12  no",
      "4  5       -60   30    1    7    15  no",
      "5  RP1a   flat  1.5  1.5   12    45  no       rearPlate",
      "6  RP1b   flat  0.5    1   12  46.5  no       rearPlate",
      "",
      "surfaces           7",
      "stop index         2",
      "stop radius        4.5",
      "last lens surface  4",
      "imgZ               47",
      "",
    ].join("\n"),
  );
});

test("show defaults to zoom 0 and focus 0, and --focus moves the image plane", async (t) => {
  const { rootDir } = freshRoot(t);
  const atInfinity = JSON.parse((await lenses(["show", "acme-singlet-50", "--json"], { rootDir })).out);
  assert.deepEqual(
    { ...atInfinity, surfaces: atInfinity.surfaces.length },
    {
      file: "src/lens-data/acme/AcmeSinglet50.data.ts",
      focusT: 0,
      imgZ: 52.5,
      key: "acme-singlet-50",
      lastLensSurfaceIndex: 2,
      name: "ACME Singlet 50mm f/4",
      stopIndex: 2,
      stopRadius: 6.25,
      surfaceCount: 3,
      surfaces: 3,
      zoomT: 0,
    },
  );
  assert.deepEqual(atInfinity.surfaces[2], {
    R: null,
    asphere: false,
    d: 47.5,
    index: 2,
    label: "STO",
    nd: 1,
    sd: 6.25,
    synthetic: null,
    z: 5,
  });
  const close = JSON.parse((await lenses(["show", "acme-singlet-50", "--focus=1", "--json"], { rootDir })).out);
  assert.equal(close.focusT, 1);
  assert.equal(close.imgZ, 57.5);
});

test("an unknown key is a usage error that suggests near keys", async (t) => {
  const { rootDir } = freshRoot(t);
  const run = await lenses(["show", "acme-zoom"], { rootDir });
  assert.equal(run.code, EXIT_USAGE);
  assert.equal(run.out, "");
  assert.equal(run.err, `lvrtc lenses: unknown lens "acme-zoom"; did you mean acme-zoom-24-48?\n${USAGE}`);
});

test("--root names the configuration root, relative to the working directory, in either spelling", async (t) => {
  const { rootDir } = freshRoot(t);
  const elsewhere = mkdtempSync(join(tmpdir(), "lvrtc-lenses-"));
  t.after(() => rmSync(elsewhere, { recursive: true, force: true }));
  mkdirSync(join(rootDir, "sub"));
  for (const args of [
    ["list", "--root", ".."],
    ["list", "--root=.."],
    ["list", `--root=${rootDir}`],
  ]) {
    const run = await lenses(args, { rootDir: elsewhere, cwd: join(rootDir, "sub") });
    assert.equal(run.code, EXIT_OK, args.join(" "));
    assert.match(run.out, /^3 lenses\n/);
  }
  const missing = await lenses(["list", "--root", "nowhere"], { rootDir: elsewhere, cwd: rootDir });
  assert.equal(missing.code, EXIT_USAGE);
  assert.equal(missing.err, `lvrtc lenses: --root nowhere: not a directory\n${USAGE}`);
});

test("the environment may name the LensVisualizer checkout", async (t) => {
  const { rootDir, lv } = freshRoot(t, {});
  const run = await lenses(["list"], { rootDir, env: { LVRTC_LV_PATH: lv } });
  assert.equal(run.code, EXIT_OK);
  assert.match(run.out, /^3 lenses\n/);
});

test("a command line that is not the synopsis is a usage error, before LensVisualizer is loaded", async (t) => {
  // The root has no LensVisualizer, so a command line that got as far as loading it would exit 1, not 2.
  const rootDir = mkdtempSync(join(tmpdir(), "lvrtc-lenses-"));
  t.after(() => rmSync(rootDir, { recursive: true, force: true }));
  const cases: [string[], string][] = [
    [[], "no action was named: there are list and show"],
    [["remove"], 'unknown action "remove": there are list and show'],
    [["show"], "no lens key was given"],
    [["show", "a", "b"], 'unexpected argument "b"'],
    [["list", "a"], 'unexpected argument "a"'],
    [["list", "--zoom", "1"], 'unknown option "--zoom"'],
    [["show", "a", "--zoom", "1.5"], '--zoom needs a number from 0 to 1, got "1.5"'],
    [["show", "a", "--zoom=-0.1"], '--zoom needs a number from 0 to 1, got "-0.1"'],
    [["show", "a", "--focus", "near"], '--focus needs a number from 0 to 1, got "near"'],
    [["show", "a", "--focus"], "--focus needs a value"],
    [["show", "a", "--verbose"], 'unknown option "--verbose"'],
  ];
  for (const [args, message] of cases) {
    const run = await lenses(args, { rootDir });
    assert.equal(run.code, EXIT_USAGE, args.join(" "));
    assert.equal(run.out, "");
    assert.equal(run.err, `lvrtc lenses: ${message}\n${USAGE}`);
  }
});

test("a LensVisualizer that is not configured, missing or not loadable is a failure that says which", async (t) => {
  const rootDir = mkdtempSync(join(tmpdir(), "lvrtc-lenses-"));
  t.after(() => rmSync(rootDir, { recursive: true, force: true }));
  const unconfigured = await lenses(["list"], { rootDir });
  assert.equal(unconfigured.code, EXIT_FAILURE);
  assert.equal(unconfigured.out, "");
  assert.match(unconfigured.err, /^lvrtc lenses: LensVisualizer is not configured: set lvPath /);

  writeFileSync(join(rootDir, CONFIG_FILE), JSON.stringify({ lvPath: "no-lv-here" }));
  const missing = await lenses(["show", "a"], { rootDir });
  assert.equal(missing.code, EXIT_FAILURE);
  assert.match(missing.err, /^lvrtc lenses: LensVisualizer path is not a directory: .*no-lv-here\n$/);

  const broken = freshRoot(t);
  rmSync(join(broken.lv, "src/optics/analysis/mtfSupport.ts"));
  const unloadable = await lenses(["list"], { rootDir: broken.rootDir });
  assert.equal(unloadable.code, EXIT_FAILURE);
  assert.match(
    unloadable.err,
    /^lvrtc lenses: LensVisualizer at .*: 1 of 9 modules cannot be imported: src\/optics\/analysis\/mtfSupport\.ts: /,
  );
});

test("--help prints the usage and loads nothing", async (t) => {
  const rootDir = mkdtempSync(join(tmpdir(), "lvrtc-lenses-"));
  t.after(() => rmSync(rootDir, { recursive: true, force: true }));
  const run = await lenses(["show", "--help"], { rootDir });
  assert.equal(run.code, EXIT_OK);
  assert.ok(run.out.startsWith(USAGE));
  assert.match(run.out, /--zoom <t> {4}zoom position from 0 \(wide\) to 1 \(tele\)/);
});
