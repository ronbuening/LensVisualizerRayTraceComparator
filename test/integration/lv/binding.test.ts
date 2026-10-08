// The binding against the real LensVisualizer. Numbers pinned here were taken at LV commit d36f44b3 and are
// canaries: when LV changes the lens or its preparation they fail and say so; they are not tolerances.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import { createLensesCommand } from "../../../src/cli/commands/lenses.ts";
import { EXIT_OK, runCli } from "../../../src/cli/main.ts";
import { REPO_ROOT } from "../../../src/core/config.ts";
import { loadLvBinding, syntheticKind } from "../../../src/engines/lv/binding.ts";
import { isLensPrescriptionFile } from "../../../src/engines/lv/fingerprint.ts";
import { LV_IMPORT_MANIFEST } from "../../../src/engines/lv/manifest.ts";
import { summarizeState } from "../../../src/engines/lv/stateSummary.ts";
import { BENCHMARK_KEYS, LV_PATH, LV_UNAVAILABLE } from "./support.ts";

const skip = LV_UNAVAILABLE;
const FINGERPRINT_PROCESS = fileURLToPath(new URL("./fingerprintProcess.ts", import.meta.url));

/** Runs `lvrtc lenses` in this process against the repository's configuration. */
async function lenses(args: readonly string[]): Promise<{ code: number; out: string; err: string }> {
  const out: string[] = [];
  const err: string[] = [];
  const command = createLensesCommand({ rootDir: REPO_ROOT, env: process.env, cwd: REPO_ROOT });
  const code = await runCli(
    ["lenses", ...args],
    { stdout: (text) => void out.push(text), stderr: (text) => void err.push(text) },
    [command],
  );
  return { code, out: out.join(""), err: err.join("") };
}

/** The fingerprint as a fresh process sees it, started in `cwd` and given the checkout as `lvPath`. */
function fingerprintInProcess(
  mode: "plain" | "scan",
  { cwd = REPO_ROOT, lvPath = LV_PATH ?? "" }: { cwd?: string; lvPath?: string } = {},
): { fingerprint: unknown; changed: string[]; lenses: number } {
  const text = execFileSync(process.execPath, [FINGERPRINT_PROCESS, lvPath, mode], { encoding: "utf8", cwd });
  return JSON.parse(text);
}

test("every module and export of the import manifest exists in LensVisualizer", { skip }, async () => {
  const binding = await loadLvBinding(LV_PATH);
  for (const { exports } of LV_IMPORT_MANIFEST) {
    for (const { as, kind } of exports) assert.equal(typeof binding.api[as], kind, as);
  }
  // The one export that is not a function: the lines the anchored indices are fitted between.
  const { C, d, e, F, g } = binding.api.spectralLinesNm;
  assert.deepEqual([C, d, e, F, g], [656.2725, 587.5618, 546.074, 486.1327, 435.8343]);
  const closure = binding.engineClosure();
  assert.ok(closure.engineFileCount >= LV_IMPORT_MANIFEST.length);
  assert.match(closure.engineClosureHash, /^[0-9a-f]{64}$/);
});

test("the catalog has one unique key per *.data.ts file", { skip }, async () => {
  const binding = await loadLvBinding(LV_PATH);
  const files = readdirSync(join(binding.root, "src", "lens-data"), { recursive: true, encoding: "utf8" }).filter(
    (name) => name.endsWith(".data.ts"),
  );
  const catalog = await binding.catalog();
  assert.deepEqual(catalog.problems, []);
  assert.equal(catalog.fileCount, files.length);
  assert.equal(catalog.entries.length, files.length);
  assert.equal(new Set(catalog.entries.map((entry) => entry.key)).size, files.length, "every key is unique");
  assert.equal(new Set(catalog.entries.map((entry) => entry.file)).size, files.length);
  for (const entry of catalog.entries) {
    assert.match(entry.fileSha256, /^[0-9a-f]{64}$/, entry.key);
    assert.ok(isLensPrescriptionFile(entry.file), entry.file);
  }
  assert.ok(files.length > 800, `LensVisualizer has about 890 lenses, found ${files.length}`);
});

test("every benchmark key resolves, and its prepared state has the shape the comparator reads", { skip }, async () => {
  const binding = await loadLvBinding(LV_PATH);
  const catalog = await binding.catalog();
  for (const key of BENCHMARK_KEYS) {
    const { entry, data } = await binding.lens(key);
    assert.equal(entry.key, key);
    assert.equal(data.key, key);
    const runtime = binding.api.buildLens(data);
    for (const zoomT of entry.zoom ? [0, 1] : [0]) {
      const state = binding.api.prepareRuntimeState(runtime, 0, zoomT);
      const summary = summarizeState(state);
      const where = `${key} at zoom ${zoomT}`;
      const last = state.surfaces.length - 1;
      assert.equal(state.z.length, state.surfaces.length, where);
      assert.equal(state.z[0], 0, where);
      assert.equal(state.imgZ, state.z[last] + state.surfaces[last].d, where);
      // The runtime stop radius is the prepared stop surface's sd: LV's wide-open stop at this zoom position.
      assert.equal(summary.stopRadius, binding.api.wideOpenStopAtZoom(zoomT, runtime), where);
      assert.equal(state.surfaces[summary.stopIndex].label, "STO", where);
      // The last lens surface is the last authored one: every surface after it, and none before, is synthetic.
      state.surfaces.forEach((surface, index) => {
        const at = `${where}, surface ${index}`;
        assert.equal(syntheticKind(surface) !== null, index > summary.lastLensSurfaceIndex, at);
        for (const member of ["R", "d", "nd", "sd", "z"] as const) assert.ok(Number.isFinite(surface[member]), at);
        assert.equal(surface.z, state.z[index], at);
        assert.equal(typeof surface.label, "string", at);
        assert.equal(typeof surface.profile.sag, "function", at);
        assert.ok(surface.nd >= 1, at);
      });
    }
  }
  assert.equal(catalog.entries.find((entry) => entry.key === "nikon-z-24-70f4s")?.zoom, true);
  assert.equal(catalog.entries.find((entry) => entry.key === "nikkor-z50f12")?.zoom, undefined);
});

test(
  "every lens of the catalog builds and prepares, with the zoom flag and stop radius the binding reports",
  { skip },
  async () => {
    const binding = await loadLvBinding(LV_PATH);
    const catalog = await binding.catalog();
    const zoomFlagWrong: string[] = [];
    const stopRadiusWrong: string[] = [];
    const syntheticMisplaced: string[] = [];
    const notFinite: string[] = [];
    for (const entry of catalog.entries) {
      const runtime = binding.api.buildLens((await binding.lens(entry.key)).data);
      // The catalog decides "zoom" from the lens file by LV's rule; LV's own answer is the built lens.
      if ((entry.zoom === true) !== runtime.isZoom) zoomFlagWrong.push(entry.key);
      for (const zoomT of entry.zoom ? [0, 1] : [0]) {
        const where = `${entry.key} at zoom ${zoomT}`;
        const summary = summarizeState(binding.api.prepareRuntimeState(runtime, 0, zoomT));
        if (summary.stopRadius !== binding.api.wideOpenStopAtZoom(zoomT, runtime)) stopRadiusWrong.push(where);
        for (const surface of summary.surfaces) {
          if ((surface.synthetic !== null) !== surface.index > summary.lastLensSurfaceIndex) {
            syntheticMisplaced.push(`${where}, surface ${surface.index}`);
          }
          const numbers = [surface.R ?? 0, surface.d, surface.nd, surface.sd, surface.z, summary.imgZ];
          if (!numbers.every(Number.isFinite)) notFinite.push(`${where}, surface ${surface.index}`);
        }
      }
    }
    assert.deepEqual(zoomFlagWrong, []);
    assert.deepEqual(stopRadiusWrong, []);
    assert.deepEqual(syntheticMisplaced, []);
    assert.deepEqual(notFinite, []);
  },
);

test("lenses show nikkor-z50f12 reports 35 surfaces with the rear plate RP1a and RP1b", { skip }, async () => {
  const run = await lenses(["show", "nikkor-z50f12", "--json"]);
  assert.equal(run.code, EXIT_OK, run.err);
  const shown = JSON.parse(run.out);
  // Canaries taken at LV d36f44b3.
  assert.equal(shown.surfaceCount, 35);
  assert.equal(shown.surfaces.length, 35);
  assert.equal(shown.stopIndex, 17);
  assert.equal(shown.lastLensSurfaceIndex, 32);
  assert.equal(shown.imgZ, 163.306);
  const labels: string[] = shown.surfaces.map((surface: { label: string }) => surface.label);
  assert.deepEqual(labels.slice(33), ["RP1a", "RP1b"]);
  assert.deepEqual(
    shown.surfaces.slice(32).map((surface: { synthetic: string | null }) => surface.synthetic),
    [null, "rearPlate", "rearPlate"],
  );
  assert.equal(shown.surfaces[33].R, null, "a rear plate is flat");
  assert.equal(shown.surfaces[17].label, "STO");
  assert.equal(shown.surfaces[17].sd, shown.stopRadius);

  const text = await lenses(["show", "nikkor-z50f12"]);
  assert.equal(text.code, EXIT_OK);
  assert.match(text.out, /^33 {2}RP1a +flat .* rearPlate$/m);
  assert.match(text.out, /^34 {2}RP1b +flat .* rearPlate$/m);
  assert.match(text.out, /^surfaces {11}35$/m);
});

test("lenses list counts every lens and an unknown key suggests the real one", { skip }, async () => {
  const binding = await loadLvBinding(LV_PATH);
  const count = (await binding.catalog()).entries.length;
  const listed = await lenses(["list"]);
  assert.equal(listed.code, EXIT_OK, listed.err);
  const lines = listed.out.trimEnd().split("\n");
  assert.equal(lines[0], `${count} lenses`);
  assert.equal(lines.length, count + 1);
  const keys = lines.slice(1).map((line) => line.split(/\s+/)[0]);
  assert.deepEqual(keys, [...keys].sort(), "sorted by key");

  const unknown = await lenses(["show", "nikkor-z50f1.2"]);
  assert.equal(unknown.code, 2);
  assert.match(unknown.err, /^lvrtc lenses: unknown lens "nikkor-z50f1\.2"; did you mean nikkor-z50f12/);
});

test(
  "the engine fingerprint is the same in two processes, and scanning the catalog does not change it",
  { skip },
  async () => {
    const plain = fingerprintInProcess("plain");
    // The second process is started elsewhere and names the checkout another way: neither is part of the identity.
    const scanned = fingerprintInProcess("scan", { cwd: tmpdir(), lvPath: join(LV_PATH ?? "", "src", "..") });
    assert.ok(scanned.lenses > 800);
    assert.deepEqual(scanned.fingerprint, plain.fingerprint);
    const { commit, dirty } = plain.fingerprint as { commit: string | null; dirty: boolean | null };
    assert.ok(commit === null ? dirty === null : /^[0-9a-f]{40}$/.test(commit) && typeof dirty === "boolean");
    assert.deepEqual(plain.changed, []);
    assert.deepEqual(scanned.changed, []);

    // This process has by now scanned the catalog and built lenses, and still has the same fingerprint.
    const binding = await loadLvBinding(LV_PATH);
    await binding.catalog();
    assert.deepEqual(binding.fingerprint(), plain.fingerprint);
    assert.deepEqual(binding.rehash(), []);
  },
);
