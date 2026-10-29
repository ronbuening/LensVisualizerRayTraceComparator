// LensVisualizer's product MTF through `lvrtc mtf` and the engine `lv`, on the real LensVisualizer: the 12
// benchmark configurations as its MTF tab opens them. What is held here is that the comparator asks exactly what the
// tab asks: the answer is LensVisualizer's own `computeMtf` for a request this file spells out again from the tab's
// source, bit for bit. Run output goes to a temporary directory.
//
// Pins were re-measured at LV 643ef5d0, closure 94778d3d (175 files); the same engine closure is at ab0fd4cf; and
// again at 098c91ef6, closure fef2e248 (178 files), unchanged; and at Stage 6.8b, at 607ff23ae, closure f016b35b
// (184 files: LV #933's stop rule and #936's MTF on the real stop), where every figure moved and was pinned anew; and
// at 6287f4393, closure fc5ae923 (184 files: LV #940), unchanged. Only the measured closure and case activate a pin: a
// lens edit is another case.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, test } from "node:test";
import { fileURLToPath } from "node:url";

import type { OpticalCase } from "../../../src/contract/case.ts";
import { MTF_NATIVE } from "../../../src/contract/quantities/mtfNative.ts";
import type { MtfNativeData, MtfNativeSpec } from "../../../src/contract/quantities/mtfNative.ts";
import { makeRequest } from "../../../src/contract/request.ts";
import { REPO_ROOT } from "../../../src/core/config.ts";
import { MTF_RUN_FILE } from "../../../src/core/mtfRun.ts";
import type { MtfRun } from "../../../src/core/mtfRun.ts";
import { formatFixed } from "../../../src/core/numeric/format.ts";
import { decodeNdArray } from "../../../src/core/numeric/ndarray.ts";
import type { NdArrayWire } from "../../../src/core/numeric/ndarray.ts";
import { resultDataProblems } from "../../../src/core/resultData.ts";
import { loadLvBinding } from "../../../src/engines/lv/binding.ts";
import type { LvBinding } from "../../../src/engines/lv/binding.ts";
import { createLvExporter } from "../../../src/engines/lv/caseSource.ts";
import { createLvEngineOn } from "../../../src/engines/lv/engine.ts";
import type {
  LvApi,
  LvAnalysisRequest,
  LvMtfRequestOptions,
  LvMtfOptions,
  LvMtfResult,
  LvPreparedState,
  LvRuntimeLens,
} from "../../../src/engines/lv/types.ts";
import { RemoteEngineAdapter } from "../../../src/engines/remote.ts";
import { mtfNativeQuantity } from "../../../src/quantities/mtfNative.ts";
import type { MtfTableRow } from "../../../src/report/mtfTable.ts";
import { createInProcessTransport } from "../../../src/transports/inProcess.ts";
import { LV_PATH, LV_UNAVAILABLE } from "./support.ts";

const skip = LV_UNAVAILABLE;
const BIN = fileURLToPath(new URL("../../../bin/lvrtc.mjs", import.meta.url));

/** The 12 benchmark configurations, in the order of the benchmark suite. */
const CONFIGURATIONS: readonly { readonly key: string; readonly zoomT: number; readonly run: string }[] = [
  { key: "canon-ef-135-f2l-usm", zoomT: 0, run: "canon-ef-135-f2l-usm" },
  { key: "fujifilm-fujinon-gf-63mm-f28-r-wr", zoomT: 0, run: "fujifilm-fujinon-gf-63mm-f28-r-wr" },
  { key: "sigma-35mm-f14-dg-hsm-a", zoomT: 0, run: "sigma-35mm-f14-dg-hsm-a" },
  { key: "nikkor-z50f12", zoomT: 0, run: "nikkor-z50f12" },
  { key: "sony-fe-20mm-f18-g", zoomT: 0, run: "sony-fe-20mm-f18-g" },
  { key: "sony-fe-400mm-f28-gm-oss", zoomT: 0, run: "sony-fe-400mm-f28-gm-oss" },
  { key: "sigma-105mm-f28-dg-dn-macro-art", zoomT: 0, run: "sigma-105mm-f28-dg-dn-macro-art" },
  { key: "nikon-z-24-70f4s", zoomT: 0, run: "nikon-z-24-70f4s" },
  { key: "nikon-z-24-70f4s", zoomT: 1, run: "nikon-z-24-70f4s-zoom1" },
  { key: "nikon-z-mc-105f28", zoomT: 0, run: "nikon-z-mc-105f28" },
  { key: "nikon-z-135f18-plena", zoomT: 0, run: "nikon-z-135f18-plena" },
  { key: "sigma-45mm-f28-dg-dn-contemporary", zoomT: 0, run: "sigma-45mm-f28-dg-dn-contemporary" },
];

/**
 * Re-measured at LV 643ef5d0 (closure 94778d3d; the same at ab0fd4cf). At Stage 4.4 the binding's import of
 * src/optics/publishedStations.ts made the closure 7b756ee6 (177 files) at ab0fd4cf; every figure was measured
 * again there and found unchanged. At Stage 6.6b, at LV 098c91ef6 (closure fef2e248, 178 files: the chief ray solved
 * below one degree, the anchored channels, the vignetting tab's beams), every figure and case was measured again and
 * found unchanged. At Stage 6.8b, at LV 607ff23ae (closure f016b35b, 184 files), every case and figure moved (LV #933
 * resized every stop by the paraxial EPD = F/N; #936 samples the pupil on the real stop at a cap of 256): measured and
 * pinned anew; no configuration's axial marginal ray is vignetted. At LV 6287f4393 (closure fc5ae923, 184 files: LV
 * #940, a finite object's aim seeded at its solved chief and `aim-failed`), every case and figure was measured again
 * and found unchanged: the 12 answers are the same bytes as at 607ff23ae.
 */
const PINNED_CLOSURE = "fc5ae9236ce310db6f3fae2e6e21db1e7baaa701bfc98b3a4cf85c479baf6e59";

/**
 * What LensVisualizer's MTF tab presents for each configuration, as `lvrtc mtf` prints it: the case the figures
 * are of, the spectrum, the focus shift in mm, the surface that vignettes the axial marginal ray ("-" where none does;
 * LV #936 traces no f-number of its own), and the sagittal and tangential MTF at 10 and 30 cycles/mm (S 10, T 10,
 * S 30, T 30) on the axis and at 70 % of the image height.
 */
const PINNED: Readonly<
  Record<
    string,
    {
      readonly caseId: string;
      readonly spectrum: string;
      readonly shift: string;
      readonly vignetted: string;
      readonly axis: readonly string[];
      readonly field70: readonly string[];
    }
  >
> = {
  "canon-ef-135-f2l-usm": {
    caseId: "5a1e4774772748058756cfcb4d918aedab000c3e4857e484254fe6688c651513",
    spectrum: "photopic",
    shift: "-0.0269",
    vignetted: "-",
    axis: ["0.9492", "0.9492", "0.7546", "0.7546"],
    field70: ["0.9428", "0.9430", "0.6692", "0.7050"],
  },
  "fujifilm-fujinon-gf-63mm-f28-r-wr": {
    caseId: "b241011c9681597d858ca830bb42493ed5d2719b1aa8782269e0f54cde52c35f",
    spectrum: "photopic",
    shift: "-0.0420",
    vignetted: "-",
    axis: ["0.9693", "0.9693", "0.8786", "0.8786"],
    field70: ["0.8312", "0.8813", "0.5938", "0.6326"],
  },
  "sigma-35mm-f14-dg-hsm-a": {
    caseId: "c14175c93aaf26b52e4fc4beda725340d2a3ad3e16d0f5c089800fdb3fb965ae",
    spectrum: "photopic",
    shift: "-0.0257",
    vignetted: "-",
    axis: ["0.9564", "0.9564", "0.7684", "0.7684"],
    field70: ["0.7152", "0.9057", "0.4754", "0.6234"],
  },
  "nikkor-z50f12": {
    caseId: "25e839a37b367ed1c9f7298f4e44f9fdb017645f73647e4f965832cb1d28ede2",
    spectrum: "photopic",
    shift: "-0.0507",
    vignetted: "-",
    axis: ["0.9756", "0.9756", "0.8540", "0.8540"],
    field70: ["0.8431", "0.9277", "0.6152", "0.6973"],
  },
  "sony-fe-20mm-f18-g": {
    caseId: "9bf71fcc2c01fb1e7c25546d8b6a2758be33c6bba8fe4742ebcd3fbac72405d7",
    spectrum: "photopic",
    shift: "-0.0394",
    vignetted: "-",
    axis: ["0.9715", "0.9715", "0.8630", "0.8630"],
    field70: ["0.7606", "0.3210", "0.1453", "0.0447"],
  },
  "sony-fe-400mm-f28-gm-oss": {
    caseId: "25a3d0697df2ed6fe2fd355a06ce5f7a89664142dadd6e7d5e049d3bbc636df7",
    spectrum: "photopic",
    shift: "0.0512",
    vignetted: "-",
    axis: ["0.9768", "0.9768", "0.9209", "0.9209"],
    field70: ["0.9737", "0.9669", "0.9017", "0.8865"],
  },
  "sigma-105mm-f28-dg-dn-macro-art": {
    caseId: "c5a507024e5ab43f94adcb83c67c948a9731a2af72fed96ac5515f6eb04f708e",
    spectrum: "photopic",
    shift: "-0.0191",
    vignetted: "-",
    axis: ["0.9733", "0.9733", "0.9023", "0.9023"],
    field70: ["0.9545", "0.9191", "0.7555", "0.5763"],
  },
  "nikon-z-24-70f4s": {
    caseId: "1bd5a8443c6b4b625eb1568bd6805873a1ccbc2caaedbba46e51ee5a5fb5d2dc",
    spectrum: "photopic",
    shift: "-0.0729",
    vignetted: "-",
    axis: ["0.9663", "0.9663", "0.8785", "0.8785"],
    field70: ["0.9640", "0.9222", "0.8718", "0.6402"],
  },
  "nikon-z-24-70f4s-zoom1": {
    caseId: "7c55143a9f94c725e66c944a44bf00e5871532ed3d91bcde1e1cffa7caa0dc33",
    spectrum: "photopic",
    shift: "0.0153",
    vignetted: "-",
    axis: ["0.9688", "0.9688", "0.9024", "0.9024"],
    field70: ["0.8553", "0.8808", "0.5863", "0.6755"],
  },
  "nikon-z-mc-105f28": {
    caseId: "e492101b147bcf0f0e156d83376aba617d1c24f20cfdcf0d82b48a03f8b4a92e",
    spectrum: "photopic",
    shift: "0.0304",
    vignetted: "-",
    axis: ["0.9756", "0.9756", "0.9167", "0.9167"],
    field70: ["0.9721", "0.9389", "0.8889", "0.7269"],
  },
  "nikon-z-135f18-plena": {
    caseId: "9ac66541b918eea604fa81c70999f824029cc1d2d481851438f0d5d7e86d8224",
    spectrum: "photopic",
    shift: "-0.0088",
    vignetted: "-",
    axis: ["0.9804", "0.9804", "0.9167", "0.9167"],
    field70: ["0.9657", "0.9660", "0.8237", "0.8605"],
  },
  "sigma-45mm-f28-dg-dn-contemporary": {
    caseId: "6f62ee09c0c8b3a1cc345e3ed0e0e27aebea0ce5e96cdbee7664ffbab4914e73",
    spectrum: "photopic",
    shift: "-0.0315",
    vignetted: "-",
    axis: ["0.9376", "0.9376", "0.7729", "0.7729"],
    field70: ["0.9519", "0.9148", "0.7649", "0.6872"],
  },
};

/**
 * The rows of LensVisualizer's committed chart-regression report for the benchmark lenses it holds
 * (agent_docs/generated/mtf-chart-regression.generated.md, "Per Configuration", as of LV commit ed78cf40; the file
 * was last written at 7ccc6933): the traced f-number, the surface that limits the axial beam and the best-axial
 * focus shift, as the report prints them.
 */
const CHART_REPORT_ROWS: Readonly<Record<string, readonly [tracedF: string, limitedBy: string, shift: string]>> = {
  "sigma-35mm-f14-dg-hsm-a": ["1.49", "14", "-0.0256"],
  "nikkor-z50f12": ["1.23", "iris", "-0.0515"],
  "sigma-105mm-f28-dg-dn-macro-art": ["2.90", "iris", "-0.0215"],
  "nikon-z-24-70f4s": ["4.00", "iris", "-0.0734"],
  "nikon-z-24-70f4s-zoom1": ["4.00", "iris", "+0.0181"],
  "nikon-z-mc-105f28": ["2.89", "iris", "+0.0294"],
  "nikon-z-135f18-plena": ["1.85", "iris", "-0.0109"],
  "sigma-45mm-f28-dg-dn-contemporary": ["2.90", "iris", "-0.0316"],
};
const CHART_REPORT = "agent_docs/generated/mtf-chart-regression.generated.md";

// ── Running the command ──────────────────────────────────────────────────────────────────────────────────────────

const directories: string[] = [];
after(() => {
  for (const directory of directories) rmSync(directory, { recursive: true, force: true });
});

function tempDir(): string {
  const directory = mkdtempSync(join(tmpdir(), "lvrtc-lv-mtf-"));
  directories.push(directory);
  return directory;
}

interface Ran {
  readonly code: number | null;
  readonly out: string;
  readonly err: string;
}

/** Runs one `lvrtc` command as a child process, on the real LensVisualizer, writing runs into `runsDir`. */
function lvrtc(runsDir: string, ...args: string[]): Promise<Ran> {
  return new Promise((resolve, reject) => {
    const env = { ...process.env, LVRTC_RUNS_DIR: runsDir, LVRTC_LV_PATH: LV_PATH ?? "" };
    const child = spawn(process.execPath, [BIN, ...args], { cwd: REPO_ROOT, env, stdio: ["ignore", "pipe", "pipe"] });
    const [out, err]: string[][] = [[], []];
    child.stdout.setEncoding("utf8").on("data", (text: string) => out.push(text));
    child.stderr.setEncoding("utf8").on("data", (text: string) => err.push(text));
    child.on("error", reject);
    child.on("close", (code) => resolve({ code, out: out.join(""), err: err.join("") }));
  });
}

/** What `lvrtc mtf --json` printed for a run: the record, and the fields of each answer as numbers. */
type Printed = MtfRun & { readonly file: string; readonly tables: Readonly<Record<string, readonly MtfTableRow[]>> };

interface Presented {
  readonly printed: Printed;
  /** The record as the command wrote it. */
  readonly recordText: string;
  readonly opticalCase: OpticalCase;
  readonly data: MtfNativeData;
}

function argsOf(configuration: (typeof CONFIGURATIONS)[number], ...more: string[]): string[] {
  // The position is always named: a zoom that is given none is presented at both ends, as two records.
  return ["mtf", configuration.key, "--zoom", String(configuration.zoomT), ...more];
}

async function present(runsDir: string, args: readonly string[]): Promise<Presented> {
  const ran = await lvrtc(runsDir, ...args, "--json");
  assert.equal(ran.code, 0, `${args.join(" ")}: ${ran.err}`);
  assert.equal(ran.err, "", args.join(" "));
  const printed: Printed = JSON.parse(ran.out);
  const [answer] = printed.answers;
  assert.deepEqual([printed.answers.length, answer.engine, answer.status], [1, "lv", "ok"], args.join(" "));
  assert.deepEqual(resultDataProblems(mtfNativeQuantity, answer.result?.data), [], args.join(" "));
  const caseFile = join(printed.file, "..", "cases", `${printed.caseId}.json`);
  return {
    printed,
    recordText: readFileSync(printed.file, "utf8"),
    opticalCase: JSON.parse(readFileSync(caseFile, "utf8")),
    data: answer.result?.data as MtfNativeData,
  };
}

let presented: Promise<ReadonlyMap<string, Presented>> | undefined;

/**
 * `lvrtc mtf <key> --engines lv` for every benchmark configuration, each in a process of its own, four at a time,
 * once for every test of this file.
 */
function benchmark(): Promise<ReadonlyMap<string, Presented>> {
  presented ??= (async () => {
    const runsDir = tempDir();
    const done = new Map<string, Presented>();
    const pending = [...CONFIGURATIONS];
    const worker = async (): Promise<void> => {
      for (let next = pending.shift(); next !== undefined; next = pending.shift()) {
        done.set(next.run, await present(runsDir, argsOf(next, "--engines", "lv")));
      }
    };
    await Promise.all([worker(), worker(), worker(), worker()]);
    return done;
  })();
  return presented;
}

// ── The tab's request, spelled out again ─────────────────────────────────────────────────────────────────────────

function curve(wire: NdArrayWire): number[] {
  return [...decodeNdArray(wire).values];
}

/** A lens of the catalog as the tab's hook holds it, and the state the tab's worker computes on. */
async function stateOf(
  binding: LvBinding,
  key: string,
  zoomT: number,
): Promise<{ runtime: LvRuntimeLens; state: LvPreparedState }> {
  const runtime = binding.api.buildLens((await binding.lens(key)).data);
  return { runtime, state: binding.api.prepareRuntimeState(runtime, 0, zoomT, 0) };
}

/**
 * The request LensVisualizer's MTF tab makes for a lens as it opens, written out from MtfTab.tsx and
 * useLensComputation.ts as they read at 607ff23ae, with the tab's defaults as literals: diffraction, the photopic
 * spectrum where the glass data allows, best axial focus, a grid cap of 256 (LV #936) and fields at 10 % steps; the
 * stop radius the stop rule's at the slider's f-number, `stopSemiDiameterForFNumber(fNumber, zoomT, L)`, and the pupil
 * radius the paraxial pupil of that stop, `entrancePupilAtState(stop, ...)` (LV #933), with the aperture slider at 0.
 * The comparator's own restatement is src/engines/lv/tabRequest.ts; this one shares no line with it.
 */
function tabRequest(binding: LvBinding, runtime: LvRuntimeLens, state: LvPreparedState): LvMtfOptions {
  const { api } = binding;
  const { focusT, zoomT } = state;
  const fNumber = api.fNumberAtStopdown(0, zoomT, runtime);
  const stop = api.stopSemiDiameterForFNumber(fNumber, zoomT, runtime);
  const fieldGeometry = api.computeAnalysisFieldGeometryAtState(focusT, zoomT, runtime, 0);
  return {
    method: "diffraction",
    spectrum: api.resolveMtfSpectrum(state, "photopic").spectrum,
    focus: "best-axial",
    maxGridSize: 256,
    fieldFractions: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    pupilSemiDiameterMm: api.entrancePupilAtState(stop, focusT, zoomT, runtime, fieldGeometry, 0).epSD,
    stopSemiDiameterMm: stop,
    movementActive: false,
  };
}

/** Holds an answer of the engine to LensVisualizer's own result for a request, bit for bit. */
function assertIsResult(data: MtfNativeData, direct: LvMtfResult, at: string): void {
  assert.equal(data.fields.length, direct.fields.length, at);
  data.fields.forEach((field, index) => {
    const theirs = direct.fields[index];
    const where = `${at}, field ${field.field}`;
    assert.equal(field.field, theirs.fieldFraction, where);
    assert.equal(field.fieldAngleDeg, theirs.fieldAngleDeg, where);
    assert.equal(field.imageHeightMm, theirs.imageHeightMm, where);
    assert.equal(field.status, theirs.status === "converged" ? "ok" : theirs.status, where);
    assert.equal(field.sampling.gridSize, theirs.gridSize, where);
    assert.equal(field.sampling.validRays, theirs.validRays, where);
    assert.equal(field.sampling.unaimedRays, theirs.unaimedRays, where);
    assert.equal(field.sampling.unresolvedInBeamRays, theirs.unresolvedInBeamRays, where);
    if (theirs.status === "unavailable") {
      assert.ok(curve(field.sagittal).every(Number.isNaN) && curve(field.tangential).every(Number.isNaN), where);
      assert.equal(field.reason, theirs.reason, where);
    } else {
      // deepEqual of node:assert/strict compares numbers as Object.is does: every bit but a NaN's payload.
      assert.deepEqual(curve(field.sagittal), theirs.sagittal, where);
      assert.deepEqual(curve(field.tangential), theirs.tangential, where);
    }
  });
  assert.deepEqual(data.focus, { mode: direct.focus?.mode, appliedShiftMm: direct.focus?.appliedShiftMm }, at);
  const vignetting = direct.axialVignetting;
  assert.equal(
    data.aperture.axialVignettingBeforeStop,
    vignetting === null ? undefined : vignetting.beforeStop ? 1 : 0,
    at,
  );
  assert.deepEqual(data.lines, direct.support.spectralLines, at);
  assert.equal(data.method.name, direct.method, at);
}

/** The largest difference between the curves of two results, over the fields that have curves in both. */
function largestDifference(a: LvMtfResult, b: LvMtfResult): number {
  let largest = 0;
  a.fields.forEach((field, index) => {
    const other = b.fields[index];
    for (const cut of ["sagittal", "tangential"] as const) {
      field[cut].forEach((value, at) => {
        if (other[cut][at] !== undefined) largest = Math.max(largest, Math.abs(value - other[cut][at]));
      });
    }
  });
  return largest;
}

/** A row of a printed table at the two frequencies the tab draws: S 10, T 10, S 30, T 30, as the command prints. */
function shown(row: MtfTableRow): string[] {
  return [row.sagittal[0], row.tangential[0], row.sagittal[1], row.tangential[1]].map((value) =>
    value === null ? "-" : formatFixed(value, 4),
  );
}

/**
 * The surface an answer says vignettes the axial marginal ray, by its label, with ", before the stop" as the tab's
 * header adds it; "-" where LensVisualizer says none does.
 */
function vignettedAt(opticalCase: OpticalCase, data: MtfNativeData): string {
  if (!Object.hasOwn(data.aperture, "axialVignettingSurfaceIndex")) return "-";
  const label = opticalCase.system.surfaces[data.aperture.axialVignettingSurfaceIndex].label;
  return data.aperture.axialVignettingBeforeStop === 1 ? `${label}, before the stop` : label;
}

/** A focus shift as LensVisualizer's report prints it: four decimals, with its sign unless it rounds to zero. */
function signed(value: number): string {
  const text = Math.abs(value).toFixed(4);
  return Number(text) === 0 ? text : `${value < 0 ? "-" : "+"}${text}`;
}

// ── The benchmark ────────────────────────────────────────────────────────────────────────────────────────────────

test(
  "lvrtc mtf presents all 12 benchmark configurations, and every value is LensVisualizer's own for the tab's request",
  { skip, timeout: 900_000 },
  async (t) => {
    const binding = await loadLvBinding(LV_PATH);
    const runs = await benchmark();
    const exporter = createLvExporter(binding);
    const measured: string[] = [];
    const offTheIris: string[] = [];
    for (const configuration of CONFIGURATIONS) {
      const { printed, opticalCase, data } = runs.get(configuration.run) as Presented;
      const at = configuration.run;
      assert.deepEqual([printed.name, printed.lensKey, printed.profile], [at, configuration.key, "lv-tab-default"]);

      // The request is the tab's: 51 frequencies from 0 to 100 cycles/mm, 11 fields, of which it draws 10 and 30.
      const spec = printed.request.spec as MtfNativeSpec;
      assert.deepEqual(
        spec.frequenciesPerMm,
        Array.from({ length: 51 }, (_unused, step) => 2 * step),
        at,
      );
      assert.deepEqual(spec.fields, {
        kind: "image-height-fractions",
        values: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
      });
      assert.deepEqual([spec.method, spec.focus, spec.profile], ["diffraction", "engine-best", "lv-tab-default"], at);
      assert.deepEqual(printed.displayedFrequenciesPerMm, [10, 30], at);
      assert.deepEqual(data.method.params.displayedFrequenciesPerMm, [10, 30], at);
      assert.deepEqual([data.method.params.profile, data.method.params.view], ["lv-tab-default", "wide-open"], at);

      // LensVisualizer's own answer to the request as this file spells it out, in this process.
      const { runtime, state } = await stateOf(binding, configuration.key, configuration.zoomT);
      const options = tabRequest(binding, runtime, state);
      const direct = binding.api.computeMtf(...lvMtfInputs(binding.api, state, options));
      assert.ok(direct.support.available, at);
      assert.deepEqual(direct.frequenciesPerMm, spec.frequenciesPerMm, at);
      assertIsResult(data, direct, at);
      // The radii the engine says it asked with are the hook's, and the stop radius is that of the case.
      assert.equal(data.method.params.pupilSemiDiameterMm, options.pupilSemiDiameterMm, at);
      assert.equal(data.method.params.stopSemiDiameterMm, options.stopSemiDiameterMm, at);
      assert.equal(opticalCase.conditions.stopSemiDiameter, options.stopSemiDiameterMm, at);
      assert.equal(data.method.params.spectrum, options.spectrum, at);
      assert.deepEqual(
        opticalCase.conditions.lines.map(({ wavelengthNm, weight }) => ({ wavelengthNm, weight })),
        data.lines,
        at,
      );
      // The case is the one a run exports for the lens wide open on the tab's lines, exactly where the stop radius
      // the hook hands the tab is the iris of the prepared state to the last bit. The hook's product and quotient
      // is not always: such a configuration is traced by the tab one unit in the last place off its own iris.
      const iris = binding.api.wideOpenStopAtZoom(configuration.zoomT, runtime);
      const plain = await exporter.exportLens(configuration.key, {
        state: { zoomT: configuration.zoomT },
        lines: { kind: "photopic" },
      });
      assert.ok(plain.ok, at);
      assert.equal(printed.caseId === plain.opticalCase.id, options.stopSemiDiameterMm === iris, at);
      assert.equal(printed.request.caseId, printed.caseId, at);
      assert.ok(Math.abs(options.stopSemiDiameterMm - iris) <= 4e-16 * iris, at);
      if (options.stopSemiDiameterMm !== iris)
        offTheIris.push(`${at} (${options.stopSemiDiameterMm} mm for ${iris} mm)`);

      const [axis, field70] = [printed.tables.lv[0], printed.tables.lv[7]];
      assert.deepEqual([axis.field, field70.field], [0, 0.7], at);
      const vignetted = vignettedAt(opticalCase, data);
      measured.push(
        `${at}: case ${printed.caseId}, ${String(data.method.params.spectrum)}, shift ` +
          `${formatFixed(data.focus.appliedShiftMm, 4)} mm, axial beam vignetted at ${vignetted}, ` +
          `axis ${shown(axis).join(" ")}, 70 % ${shown(field70).join(" ")}, grids ` +
          `${data.fields.map((field) => field.sampling.gridSize).join(" ")}, ` +
          `${data.fields.filter((field) => field.status !== "ok").length} fields not ok`,
      );

      // The figures LensVisualizer presents, as they were measured: held while the engine files and the lens are
      // the ones they were measured with.
      const pinned = PINNED[at];
      if (binding.fingerprint().engineClosureHash === PINNED_CLOSURE && pinned?.caseId === printed.caseId) {
        assert.equal(data.method.params.spectrum, pinned.spectrum, at);
        assert.equal(formatFixed(data.focus.appliedShiftMm, 4), pinned.shift, at);
        assert.equal(vignetted, pinned.vignetted, at);
        assert.deepEqual(shown(axis), pinned.axis, at);
        assert.deepEqual(shown(field70), pinned.field70, at);
      } else {
        t.diagnostic(`${at}: the pinned figures are of another engine closure or another case, and are not compared`);
      }
    }
    for (const line of measured) t.diagnostic(line);
    // At ed78cf40 that is one of the twelve: nikon-z-mc-105f28.
    t.diagnostic(`traced by the tab off the prepared iris by one rounding: ${offTheIris.join(", ") || "none"}`);
    const { commit, engineClosureHash } = binding.fingerprint();
    t.diagnostic(`LensVisualizer ${String(commit)}, engine closure ${engineClosureHash}`);
  },
);

test(
  "the lens the tab's worker rebuilds from the built one gives the same MTF as the lens of the catalog",
  { skip, timeout: 300_000 },
  async (t) => {
    const binding = await loadLvBinding(LV_PATH);
    // A lens with a rear plate at ed78cf40, which the built lens carries as generated surfaces the worker strips.
    const { runtime, state } = await stateOf(binding, "nikkor-z50f12", 0);
    interface Authored {
      readonly surfaces: readonly { readonly synthetic?: unknown }[];
      readonly elements: readonly { readonly synthetic?: unknown }[];
    }
    const data = runtime.source as unknown as Authored & {
      readonly kind: "lens";
      readonly key: string;
      readonly name: string;
    };
    const generated = data.surfaces.filter((surface) => surface.synthetic).length;
    t.diagnostic(`nikkor-z50f12: the built lens carries ${generated} generated surfaces, which the worker strips`);
    const rebuilt = binding.api.buildLens({
      ...data,
      surfaces: data.surfaces.filter((surface) => !surface.synthetic),
      elements: data.elements.filter((element) => !element.synthetic),
    });
    const options = tabRequest(binding, runtime, state);
    assert.deepEqual(tabRequest(binding, rebuilt, binding.api.prepareRuntimeState(rebuilt, 0, 0, 0)), options);
    const theirs = binding.api.computeMtf(
      ...lvMtfInputs(binding.api, binding.api.prepareRuntimeState(rebuilt, 0, 0, 0), options),
    );
    const mine = (await benchmark()).get("nikkor-z50f12") as Presented;
    assertIsResult(mine.data, theirs, "nikkor-z50f12, rebuilt as the worker rebuilds it");
  },
);

test(
  "the pupil radius of the request scales LensVisualizer's aimed launch: the stored nominal pupil moves its rays",
  { skip, timeout: 300_000 },
  async (t) => {
    const binding = await loadLvBinding(LV_PATH);
    const runs = await benchmark();
    for (const run of ["canon-ef-135-f2l-usm", "sony-fe-400mm-f28-gm-oss", "nikon-z-mc-105f28"]) {
      const configuration = CONFIGURATIONS.find((candidate) => candidate.run === run);
      assert.ok(configuration !== undefined);
      const { runtime, state } = await stateOf(binding, configuration.key, configuration.zoomT);
      const options = tabRequest(binding, runtime, state);
      // The lens's stored nominal pupil, focal length over twice the marked f-number (`L.EP.epSD`), which the tab's
      // paraxial pupil of the rule's stop equals to a rounding since LV #933; its audit scripts now pass the latter.
      const nominal = (runtime.EP as { readonly epSD: number }).epSD;
      const audit = binding.api.computeMtf(
        ...lvMtfInputs(binding.api, state, { ...options, pupilSemiDiameterMm: nominal }),
      );
      const tab = binding.api.computeMtf(...lvMtfInputs(binding.api, state, options));
      const { data } = runs.get(run) as Presented;
      // What lvrtc mtf printed is the tab's, to the bit.
      assertIsResult(data, tab, run);
      const difference = largestDifference(tab, audit);
      const seeds = `${nominal} mm for ${options.pupilSemiDiameterMm} mm`;
      t.diagnostic(`${run}: pupil ${seeds}: the MTF differs by up to ${difference}`);
      // The pupil radius sizes the aimed launch's Jacobian probes, and a lattice is aimed to a tolerance, never
      // polished: another radius is other rays, to the tolerance of 1e-7 of the stop radius, and so another MTF in its
      // last digits only.
      assert.ok(Math.abs(nominal / options.pupilSemiDiameterMm - 1) < 1e-9, `${run}: ${seeds}`);
      assert.ok(difference < 1e-4, `${run}: ${difference}`);
    }
  },
);

test(
  "the focus shift is that of LensVisualizer's own chart-regression request, which asks the tab's stop and pupil",
  { skip, timeout: 300_000 },
  async (t) => {
    const binding = await loadLvBinding(LV_PATH);
    const runs = await benchmark();
    const report = readFileSync(join(LV_PATH ?? "", ...CHART_REPORT.split("/")), "utf8");
    for (const [run, [, , shift]] of Object.entries(CHART_REPORT_ROWS)) {
      const configuration = CONFIGURATIONS.find((candidate) => candidate.run === run);
      assert.ok(configuration !== undefined, run);
      const { data } = runs.get(run) as Presented;
      const { runtime, state } = await stateOf(binding, configuration.key, configuration.zoomT);

      // The report does not ask what the tab asks: its fields and frequencies are those of the charts, and its radii
      // the iris and the state's paraxial entrance pupil of it, which since LV #933 are the tab's wide open. None of
      // that enters the axial focus search, which the report's own request, asked here for the axis alone, shows.
      const options = tabRequest(binding, runtime, state);
      const stop = binding.api.wideOpenStopAtZoom(configuration.zoomT, runtime);
      const geometry = binding.api.computeAnalysisFieldGeometryAtState(0, configuration.zoomT, runtime, 0);
      const pupil = binding.api.entrancePupilAtState(stop, 0, configuration.zoomT, runtime, geometry, 0).epSD;
      assert.equal(stop, options.stopSemiDiameterMm, run);
      assert.equal(pupil, options.pupilSemiDiameterMm, run);
      const theirs = binding.api.computeMtf(
        ...lvMtfInputs(binding.api, state, {
          ...options,
          frequenciesPerMm: [0, 10, 20, 30, 40, 50],
          fieldFractions: [0],
          pupilSemiDiameterMm: pupil,
          stopSemiDiameterMm: stop,
        }),
      );
      assert.ok(theirs.focus !== null, run);
      assert.equal(theirs.focus.appliedShiftMm, data.focus.appliedShiftMm, run);
      // LensVisualizer's committed report (607ff23ae) is of its MTF before #936, which the PR says is regenerated after
      // the merge: its rows are a record of the past, compared in words only.
      const measured = signed(data.focus.appliedShiftMm);
      if (measured !== shift) t.diagnostic(`${run}: shift ${measured}; the committed report's row says ${shift}`);
      const zoom = configuration.zoomT;
      const row = new RegExp(`^\\| \`${configuration.key}\` \\| ${zoom} \\|`, "m");
      if (!row.test(report)) t.diagnostic(`${run}: ${CHART_REPORT} no longer holds a row of the configuration`);
    }
  },
);

test("two processes present the same lens with the same bytes", { skip, timeout: 300_000 }, async () => {
  const [configuration] = CONFIGURATIONS;
  const first = (await benchmark()).get(configuration.run) as Presented;
  const second = await present(tempDir(), argsOf(configuration, "--engines", "lv"));
  assert.equal(second.recordText, first.recordText);
  const { file: _first, ...one } = first.printed;
  const { file: _second, ...other } = second.printed;
  assert.deepEqual(other, one);
  // Nothing of the machine or of the moment is in what was written.
  for (const absent of [REPO_ROOT, LV_PATH ?? "?", "/Users/", "/home/", "computed", "cached"]) {
    assert.ok(!first.recordText.includes(absent), absent);
  }
  assert.equal(first.printed.file.endsWith(join("mtf", "lv-tab-default", configuration.run, MTF_RUN_FILE)), true);
});

// ── The f/8 comparison ───────────────────────────────────────────────────────────────────────────────────────────

test(
  "--aperture f/8 is the tab's comparison: the stop rule's f/8 stop, which is the slider's f/8 to the bit",
  { skip, timeout: 300_000 },
  async (t) => {
    const binding = await loadLvBinding(LV_PATH);
    const runsDir = tempDir();
    const exporter = createLvExporter(binding);
    for (const configuration of CONFIGURATIONS) {
      const { printed, opticalCase, data } = await present(runsDir, argsOf(configuration, "--aperture", "f/8"));
      const at = `${configuration.run} at f/8`;
      assert.equal(printed.name, `${configuration.run}-f8`);
      const { runtime, state } = await stateOf(binding, configuration.key, configuration.zoomT);
      const wideOpen = tabRequest(binding, runtime, state);
      // MtfTab.tsx (LV #933): the stop rule's f/8 stop, and the wide-open pupil times the ratio of the two stops.
      const stop = binding.api.stopSemiDiameterForFNumber(8, configuration.zoomT, runtime);
      const options = {
        ...wideOpen,
        pupilSemiDiameterMm: (wideOpen.pupilSemiDiameterMm * stop) / wideOpen.stopSemiDiameterMm,
        stopSemiDiameterMm: stop,
      };
      assert.equal(opticalCase.conditions.stopSemiDiameter, options.stopSemiDiameterMm, at);
      assert.deepEqual([data.method.params.view, data.method.params.fNumber], ["f8-comparison", 8], at);
      assertIsResult(data, binding.api.computeMtf(...lvMtfInputs(binding.api, state, options)), at);
      // The case of the tab's comparison is the case of the slider at f/8, to the bit: the same stop radius, and so
      // the same case id (CLAUDE.md: lv-f8-comparison and f-number 8 now give one double). Both on the tab's lines.
      const lines = { kind: data.method.params.spectrum as "photopic" | "reference" | "cdf" };
      const slider = await exporter.exportLens(configuration.key, {
        state: { zoomT: configuration.zoomT },
        aperture: { kind: "f-number", value: 8 },
        lines,
      });
      const comparison = await exporter.exportLens(configuration.key, {
        state: { zoomT: configuration.zoomT },
        aperture: { kind: "lv-f8-comparison" },
        lines,
      });
      assert.ok(slider.ok && comparison.ok, at);
      assert.equal(slider.opticalCase.conditions.stopSemiDiameter, stop, at);
      assert.equal(comparison.opticalCase.id, slider.opticalCase.id, at);
      assert.equal(comparison.opticalCase.id, printed.caseId, at);
      // Whose pupil the MTF is asked with is not in the case: the tab's comparison's, which is not the slider's
      // paraxial pupil of the stop to the bit on every lens (lvPupilSeed).
      const geometry = binding.api.computeAnalysisFieldGeometryAtState(0, configuration.zoomT, runtime, 0);
      const sliderPupil = binding.api.entrancePupilAtState(stop, 0, configuration.zoomT, runtime, geometry, 0).epSD;
      if (sliderPupil !== options.pupilSemiDiameterMm)
        t.diagnostic(`${at}: the slider's pupil ${sliderPupil} mm, the comparison's ${options.pupilSemiDiameterMm} mm`);
    }

    // A lens that is not faster than f/7.95 wide open, or does not stop down to f/8, has no such comparison in the
    // tab, and the answer is the tab's reason. At ed78cf40 this zoom is f/8.2 at its long end; whatever it is
    // when this runs, the answer follows the tab's rule for it.
    const slowKey = "sony-fe-400-800-f63-8-g-oss";
    const slowLens = await stateOf(binding, slowKey, 1);
    const fNumber = binding.api.fNumberAtStopdown(0, 1, slowLens.runtime);
    const offered = fNumber < 8 - 0.05 && slowLens.runtime.maxFstop >= 8;
    // A lens at f/8 or slower wide open has the stop rule's f/8 stop for its wide-open stop (LV #933): its comparison is
    // its wide-open case, which the engine answers as such.
    const wideOpenCase = fNumber >= 8;
    const slow = await lvrtc(runsDir, "mtf", slowKey, "--zoom", "1", "--aperture", "f/8");
    assert.equal(slow.code, 0, slow.err);
    assert.match(
      slow.out,
      offered || wideOpenCase
        ? /^lv {2}ok {2}computed$/m
        : /^lv {2}unsupported {2}computed\n {2}feature aperture\.f8-comparison: the lens /m,
    );
  },
);

// ── Without a profile ────────────────────────────────────────────────────────────────────────────────────────────

test(
  "without a profile the answer is LensVisualizer's own for the spec, the lines and the stop of the case",
  { skip, timeout: 300_000 },
  async (t) => {
    const binding = await loadLvBinding(LV_PATH);
    const { api } = binding;
    const lv = new RemoteEngineAdapter({ id: "lv", transport: createInProcessTransport(createLvEngineOn(binding)) });
    t.after(() => lv.close());
    const exporter = createLvExporter(binding);
    const key = "sigma-105mm-f28-dg-dn-macro-art";
    const runtime = api.buildLens((await binding.lens(key)).data);
    const values = [0, 0.5, 1];

    // What is asked: the lens as it opens on its reference line; stopped down to f/5.6 on the C, d and F lines at
    // LensVisualizer's best focus with a grid cap of 64; and at its closest focus, where the object is finite.
    const asked: readonly {
      readonly said: string;
      readonly focusT: number;
      readonly export: Parameters<typeof exporter.exportLens>[1];
      readonly spec: MtfNativeSpec;
      readonly engineOptions?: { lvGridCap: number };
      readonly request: Pick<LvMtfOptions, "method" | "spectrum" | "focus"> & { maxGridSize: number };
    }[] = [
      {
        said: "as it opens, reference line",
        focusT: 0,
        export: {},
        spec: {
          frequenciesPerMm: [10, 30],
          fields: { kind: "image-height-fractions", values },
          method: "geometric",
          focus: "design",
        },
        request: { method: "geometric", spectrum: "reference", focus: "design", maxGridSize: 256 },
      },
      {
        said: "f/5.6, C d F, best focus, cap 64",
        focusT: 0,
        export: { aperture: { kind: "f-number", value: 5.6 }, lines: { kind: "cdf" } },
        spec: {
          frequenciesPerMm: [0, 20, 40, 60],
          fields: { kind: "image-height-fractions", values },
          method: "diffraction",
          focus: "engine-best",
        },
        engineOptions: { lvGridCap: 64 },
        request: { method: "diffraction", spectrum: "cdf", focus: "best-axial", maxGridSize: 64 },
      },
      {
        said: "closest focus, reference line",
        focusT: 1,
        export: { state: { zoomT: 0, focus: { kind: "focusT", value: 1 } } },
        spec: {
          frequenciesPerMm: [10, 30],
          fields: { kind: "image-height-fractions", values },
          method: "diffraction",
          focus: "engine-best",
        },
        request: { method: "diffraction", spectrum: "reference", focus: "best-axial", maxGridSize: 256 },
      },
    ];
    for (const one of asked) {
      const at = `${key}, ${one.said}`;
      const exported = await exporter.exportLens(key, one.export);
      if (!exported.ok) {
        // At ed78cf40 LensVisualizer certifies this lens's closest focus; a lens edit may withdraw that.
        t.diagnostic(`${at}: no case (${exported.problems.map((problem) => problem.code).join(", ")})`);
        continue;
      }
      const { opticalCase } = exported;
      const stop = opticalCase.conditions.stopSemiDiameter;
      // The pupil by the hook's rule (LV #933): the state's paraxial pupil of that stop radius.
      const state = api.prepareRuntimeState(runtime, one.focusT, 0, 0);
      const geometry = api.computeAnalysisFieldGeometryAtState(one.focusT, 0, runtime, 0);
      const pupil = api.entrancePupilAtState(stop, one.focusT, 0, runtime, geometry, 0).epSD;
      const direct = api.computeMtf(
        ...lvMtfInputs(api, state, {
          ...one.request,
          fieldFractions: values,
          frequenciesPerMm: one.spec.frequenciesPerMm,
          pupilSemiDiameterMm: pupil,
          stopSemiDiameterMm: stop,
          movementActive: false,
        }),
      );
      assert.ok(direct.support.available, at);
      const request = makeRequest({
        caseId: opticalCase.id,
        quantity: MTF_NATIVE,
        spec: one.spec,
        ...(one.engineOptions === undefined ? {} : { engineOptions: one.engineOptions }),
      });
      const result = await lv.run(request, opticalCase);
      assert.equal(result.status, "ok", `${at}: ${JSON.stringify(result.error ?? result.unsupported)}`);
      assert.deepEqual(resultDataProblems(mtfNativeQuantity, result.data), [], at);
      const data = result.data as MtfNativeData;
      assertIsResult(data, direct, at);
      assert.equal(data.method.params.pupilSemiDiameterMm, pupil, at);
      assert.equal(data.method.params.profile, undefined, at);
      t.diagnostic(
        `${at}: ${opticalCase.conditions.object.kind} object, shift ${formatFixed(data.focus.appliedShiftMm, 4)} mm, ` +
          `axial beam vignetted at ${vignettedAt(opticalCase, data)}`,
      );
    }
  },
);

// ── What LensVisualizer takes in one request ─────────────────────────────────────────────────────────────────────

test(
  "a spec beyond what LensVisualizer takes in one request is unsupported, with its gate's message, and no failure",
  { skip, timeout: 300_000 },
  async (t) => {
    const binding = await loadLvBinding(LV_PATH);
    const { api } = binding;
    const lv = new RemoteEngineAdapter({ id: "lv", transport: createInProcessTransport(createLvEngineOn(binding)) });
    t.after(() => lv.close());
    const key = "nikkor-z50f12";
    const exported = await createLvExporter(binding).exportLens(key, {});
    assert.ok(exported.ok);
    const { opticalCase } = exported;
    const { runtime, state } = await stateOf(binding, key, 0);
    const { pupilSemiDiameterMm, stopSemiDiameterMm } = tabRequest(binding, runtime, state);
    const axis: MtfNativeSpec = {
      frequenciesPerMm: [10, 30],
      fields: { kind: "image-height-fractions", values: [0] },
      method: "geometric",
      focus: "design",
    };
    const fractions = (count: number): MtfNativeSpec["fields"] => ({
      kind: "image-height-fractions",
      values: Array.from({ length: count }, (_unused, index) => index / (count - 1)),
    });
    const steps = (count: number, step: number) => Array.from({ length: count }, (_unused, index) => step * index);
    // At ed78cf40 LensVisualizer takes 101 fields and 501 frequencies, none above 1000 cycles/mm
    // (src/optics/analysis/mtfConstants.ts). Whatever its limits are when this runs, the engine answers as its gate
    // does; that these three specs are beyond them is held while the engine files are the pinned ones.
    const beyond: readonly (readonly [said: string, spec: MtfNativeSpec, item: string])[] = [
      ["102 fields", { ...axis, fields: fractions(102) }, "fields.limits"],
      ["502 frequencies", { ...axis, frequenciesPerMm: steps(502, 1) }, "frequenciesPerMm.limits"],
      ["1001 cycles/mm", { ...axis, frequenciesPerMm: [10, 1001] }, "frequenciesPerMm.limits"],
    ];
    for (const [said, spec, item] of beyond) {
      const gate = api.assessMtfSupport(
        ...lvMtfInputs(api, state, {
          method: "geometric",
          spectrum: "reference",
          focus: "design",
          pupilSemiDiameterMm,
          stopSemiDiameterMm,
          fieldFractions: spec.fields.values,
          frequenciesPerMm: spec.frequenciesPerMm,
        }),
      );
      if (binding.fingerprint().engineClosureHash === PINNED_CLOSURE) assert.equal(gate.reason, "invalid-input", said);
      if (gate.available) {
        t.diagnostic(`LensVisualizer now takes ${said} in one request`);
        continue;
      }
      const result = await lv.run(makeRequest({ caseId: opticalCase.id, quantity: MTF_NATIVE, spec }), opticalCase);
      assert.equal(result.status, "unsupported", `${said}: ${JSON.stringify(result.error)}`);
      assert.deepEqual(
        result.unsupported?.map((refused) => [refused.code, refused.item]),
        [["option", item]],
        said,
      );
      assert.ok(result.unsupported?.[0].message.endsWith(`: ${gate.message}`), said);
    }

    // At those limits a request is answered: 501 frequencies up to 1000 cycles/mm, on the axis.
    const most: MtfNativeSpec = { ...axis, frequenciesPerMm: steps(501, 2) };
    const answered = await lv.run(
      makeRequest({ caseId: opticalCase.id, quantity: MTF_NATIVE, spec: most }),
      opticalCase,
    );
    if (binding.fingerprint().engineClosureHash === PINNED_CLOSURE) assert.equal(answered.status, "ok");
    if (answered.status === "ok") {
      assert.deepEqual(resultDataProblems(mtfNativeQuantity, answered.data), []);
      assert.equal(curve((answered.data as MtfNativeData).fields[0].sagittal).length, 501);
    }
  },
);

// ── Lenses LensVisualizer shows no MTF for ───────────────────────────────────────────────────────────────────────

test(
  "every exported lens that LensVisualizer's MTF gate refuses is answered as the gate does, with its reason",
  { skip, timeout: 300_000 },
  async (t) => {
    const binding = await loadLvBinding(LV_PATH);
    const { api } = binding;
    const lv = new RemoteEngineAdapter({ id: "lv", transport: createInProcessTransport(createLvEngineOn(binding)) });
    t.after(() => lv.close());
    const exporter = createLvExporter(binding);
    const spec: MtfNativeSpec = {
      frequenciesPerMm: [10, 30],
      fields: { kind: "image-height-fractions", values: [0, 0.5, 1] },
      method: "diffraction",
      focus: "engine-best",
    };
    const refused: string[] = [];
    for (const { key } of (await binding.catalog()).entries) {
      const exported = await exporter.exportLens(key, {});
      if (!exported.ok) continue;
      const { runtime, state } = await stateOf(binding, key, 0);
      const gate = api.assessMtfSupport(...lvMtfInputs(api, state, tabRequest(binding, runtime, state)));
      if (gate.available) continue;
      const { opticalCase } = exported;
      const result = await lv.run(makeRequest({ caseId: opticalCase.id, quantity: MTF_NATIVE, spec }), opticalCase);
      assert.equal(result.status, "unsupported", key);
      assert.deepEqual(result.unsupported, [{ code: "feature", item: gate.reason, message: gate.message }], key);
      refused.push(`${key} (${String(gate.reason)})`);
    }
    // At ed78cf40 these are 12 lenses, every one a fisheye, which LensVisualizer's gate calls an unsupported path.
    t.diagnostic(`${refused.length} exported lenses have no MTF in LensVisualizer: ${refused.join(", ")}`);
    if (refused.length === 0) return;

    // Through the command, such a lens is presented as LensVisualizer presents it: no MTF, and why.
    const fisheye = await lvrtc(tempDir(), "mtf", refused[0].split(" ")[0]);
    assert.equal(fisheye.code, 0, fisheye.err);
    assert.match(fisheye.out, /^lv {2}unsupported {2}computed\n {2}feature [a-z-]+: \S/m);
  },
);

/** Independent worker request restatement, sharing no request builder with the comparator. */
function lvMtfInputs(
  api: Pick<LvApi, "createAnalysisRequest">,
  state: LvPreparedState,
  options: LvMtfOptions,
): [LvAnalysisRequest, LvMtfRequestOptions] {
  const request = api.createAnalysisRequest({
    preparedState: state,
    dynamicEFL: 0,
    currentEPSD: options.pupilSemiDiameterMm,
    currentPhysStopSD: options.stopSemiDiameterMm,
  });
  const { pupilSemiDiameterMm: _pupil, stopSemiDiameterMm: _stop, ...settings } = options;
  return [request, settings];
}
