// LensVisualizer's product MTF through `lvrtc mtf` and the engine `lv`, on the real LensVisualizer: the 12
// benchmark configurations as its MTF tab opens them. What is held here is that the comparator asks exactly what the
// tab asks: the answer is LensVisualizer's own `computeMtf` for a request this file spells out again from the tab's
// source, bit for bit. Run output goes to a temporary directory.
//
// The figures pinned below were measured at LV commit ed78cf40 with the engine closure 1827eefe. They are compared
// only while the engine closure and the case of a configuration are still the ones they were measured with: the
// checkout changes by the day, and a lens that was edited is another lens.
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
import type { LvMtfOptions, LvMtfResult, LvPreparedState, LvRuntimeLens } from "../../../src/engines/lv/types.ts";
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

/** The engine closure the pinned figures were measured with, at LV commit ed78cf40. */
const PINNED_CLOSURE = "1827eefe0737daa58c8e34ba1b8e570986fc081fef8b467e325d4896375b16b0";

/**
 * What LensVisualizer's MTF tab presents for each configuration, as `lvrtc mtf` prints it: the case the figures
 * are of, the spectrum, the focus shift in mm, the traced f-number, and the sagittal and tangential MTF at 10 and
 * 30 cycles/mm (S 10, T 10, S 30, T 30) on the axis and at 70 % of the image height.
 */
const PINNED: Readonly<
  Record<
    string,
    {
      readonly caseId: string;
      readonly spectrum: string;
      readonly shift: string;
      readonly tracedF: string;
      readonly axis: readonly string[];
      readonly field70: readonly string[];
    }
  >
> = {
  "canon-ef-135-f2l-usm": {
    caseId: "7546b205d77d460b81f5677e6f68df4e9dd48411a4daf40ae81d369241376dfb",
    spectrum: "photopic",
    shift: "-0.0280",
    tracedF: "2.0593",
    axis: ["0.9487", "0.9487", "0.7512", "0.7512"],
    field70: ["0.9442", "0.9440", "0.6761", "0.7111"],
  },
  "fujifilm-fujinon-gf-63mm-f28-r-wr": {
    caseId: "b8f48f28bf24a2f9c1b3a21a1bc99860d4e459b20d1281ec2af3069c9a3111c6",
    spectrum: "photopic",
    shift: "-0.0426",
    tracedF: "2.8670",
    axis: ["0.9699", "0.9699", "0.8813", "0.8813"],
    field70: ["0.8351", "0.8794", "0.5916", "0.6270"],
  },
  "sigma-35mm-f14-dg-hsm-a": {
    caseId: "1c6f0b1cef5938e7761eb57799b4c1a56426c888a5cd008ac534ec3aed4bc295",
    spectrum: "photopic",
    shift: "-0.0256",
    tracedF: "1.4854",
    axis: ["0.9571", "0.9571", "0.7706", "0.7706"],
    field70: ["0.7245", "0.9059", "0.4818", "0.6297"],
  },
  "nikkor-z50f12": {
    caseId: "a48cd12c268fce7f40073f4073332978ffe6aa0b31c3df5430eda49655dc8743",
    spectrum: "photopic",
    shift: "-0.0515",
    tracedF: "1.2278",
    axis: ["0.9753", "0.9753", "0.8494", "0.8494"],
    field70: ["0.8501", "0.9308", "0.6273", "0.7047"],
  },
  "sony-fe-20mm-f18-g": {
    caseId: "578066dcc4d993c9e2998eed77b34361e33cb29701fa3bfa8ff2c694db137b3c",
    spectrum: "photopic",
    shift: "-0.0400",
    tracedF: "1.8507",
    axis: ["0.9615", "0.9615", "0.8173", "0.8173"],
    field70: ["0.7398", "0.3123", "0.1115", "0.0263"],
  },
  "sony-fe-400mm-f28-gm-oss": {
    caseId: "2a0ec3806b69968108caa7beaf501604584cfad203f842420a3fb7aefa4c6828",
    spectrum: "photopic",
    shift: "0.0511",
    tracedF: "2.9081",
    axis: ["0.9773", "0.9773", "0.9223", "0.9223"],
    field70: ["0.9739", "0.9667", "0.9018", "0.8861"],
  },
  "sigma-105mm-f28-dg-dn-macro-art": {
    caseId: "8894694fd3bae9f442610f1015ab84b93b6e4e002d18d38b39ac103232f48f85",
    spectrum: "photopic",
    shift: "-0.0215",
    tracedF: "2.8978",
    axis: ["0.9717", "0.9717", "0.8922", "0.8922"],
    field70: ["0.9585", "0.9247", "0.7814", "0.6011"],
  },
  "nikon-z-24-70f4s": {
    caseId: "028766236f660e50f5758c50196a3781bb32d228d8d7b9536f143cdad27d83c4",
    spectrum: "photopic",
    shift: "-0.0734",
    tracedF: "4.0019",
    axis: ["0.9662", "0.9662", "0.8775", "0.8775"],
    field70: ["0.9644", "0.9232", "0.8733", "0.6426"],
  },
  "nikon-z-24-70f4s-zoom1": {
    caseId: "b59d35d7c806b2049983b82296e1bd9c09410a057c81fcc475e497554e09b6aa",
    spectrum: "photopic",
    shift: "0.0181",
    tracedF: "4.0048",
    axis: ["0.9685", "0.9685", "0.9029", "0.9029"],
    field70: ["0.8519", "0.8881", "0.5974", "0.6896"],
  },
  "nikon-z-mc-105f28": {
    caseId: "a5b613029b9a390d4812974b8f9428b9b44b938a75cc6ed5ea55af41842d4c92",
    spectrum: "photopic",
    shift: "0.0294",
    tracedF: "2.8904",
    axis: ["0.9750", "0.9750", "0.9133", "0.9133"],
    field70: ["0.9725", "0.9400", "0.8909", "0.7350"],
  },
  "nikon-z-135f18-plena": {
    caseId: "783c198b65d92ad17c8fd60a0b2ebf6db6bb170fe7cecbe9ff5c1d72b5da4cdd",
    spectrum: "photopic",
    shift: "-0.0109",
    tracedF: "1.8467",
    axis: ["0.9808", "0.9808", "0.9115", "0.9115"],
    field70: ["0.9685", "0.9704", "0.8386", "0.8765"],
  },
  "sigma-45mm-f28-dg-dn-contemporary": {
    caseId: "0d6bf53241b18117397d8e5ed7e0ea2c198ce050f6af301e88ae5e0fffbf2ea7",
    spectrum: "photopic",
    shift: "-0.0316",
    tracedF: "2.8980",
    axis: ["0.9370", "0.9370", "0.7722", "0.7722"],
    field70: ["0.9521", "0.9163", "0.7656", "0.6900"],
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
 * useLensComputation.ts as they read at ed78cf40, with the tab's defaults as literals: diffraction, the photopic
 * spectrum where the glass data allows, best axial focus, a grid cap of 128 and fields at 10 % steps; the stop
 * radius `(wideOpenStopSD * currentFOPEN) / fNumber` and the pupil radius `(baseEPSD * currentFOPEN) / fNumber`,
 * with the aperture slider at 0. The comparator's own restatement is src/engines/lv/tabRequest.ts; this one shares
 * no line with it.
 */
function tabRequest(binding: LvBinding, runtime: LvRuntimeLens, state: LvPreparedState): LvMtfOptions {
  const { api } = binding;
  const { focusT, zoomT } = state;
  const currentFOPEN = api.fopenAtZoom2(zoomT, runtime);
  const fNumber = api.fNumberAtStopdown(0, zoomT, runtime);
  const wideOpenStopSD = api.wideOpenStopAtZoom(zoomT, runtime);
  const fieldGeometry = api.computeAnalysisFieldGeometryAtState2(focusT, zoomT, runtime, 0);
  const baseEPSD = api.entrancePupilAtState2(wideOpenStopSD, focusT, zoomT, runtime, fieldGeometry, 0).epSD;
  return {
    method: "diffraction",
    spectrum: api.resolveMtfSpectrum(state, "photopic").spectrum,
    focus: "best-axial",
    maxGridSize: 128,
    fieldFractions: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    pupilSemiDiameterMm: (baseEPSD * currentFOPEN) / fNumber,
    stopSemiDiameterMm: (wideOpenStopSD * currentFOPEN) / fNumber,
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
  assert.equal(data.aperture.tracedFNumber, direct.aperture?.tracedFNumber, at);
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
 * What an answer says bounds the axial beam, in the words of LensVisualizer's report: "iris", or the label of the
 * surface; "-" where LensVisualizer found no rim of the beam.
 */
function limitOf(opticalCase: OpticalCase, data: MtfNativeData): string {
  if (!Object.hasOwn(data.aperture, "limitingSurfaceIndex")) return "-";
  const index = data.aperture.limitingSurfaceIndex;
  return index === opticalCase.system.stopIndex ? "iris" : opticalCase.system.surfaces[index].label;
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
      const direct = binding.api.computeMtf(state, options);
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
      const limitedBy = limitOf(opticalCase, data);
      measured.push(
        `${at}: case ${printed.caseId.slice(0, 12)}, ${String(data.method.params.spectrum)}, shift ` +
          `${formatFixed(data.focus.appliedShiftMm, 4)} mm, traced f/${formatFixed(data.aperture.tracedFNumber, 4)} ` +
          `(${limitedBy}), axis ${shown(axis).join(" ")}, 70 % ${shown(field70).join(" ")}, grids ` +
          `${data.fields.map((field) => field.sampling.gridSize).join(" ")}, ` +
          `${data.fields.filter((field) => field.status !== "ok").length} fields not ok`,
      );

      // The figures LensVisualizer presents, as they were measured: held while the engine files and the lens are
      // the ones they were measured with.
      const pinned = PINNED[at];
      if (binding.fingerprint().engineClosureHash === PINNED_CLOSURE && pinned?.caseId === printed.caseId) {
        assert.equal(data.method.params.spectrum, pinned.spectrum, at);
        assert.equal(formatFixed(data.focus.appliedShiftMm, 4), pinned.shift, at);
        assert.equal(formatFixed(data.aperture.tracedFNumber, 4), pinned.tracedF, at);
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
    const data = runtime.data as Authored & { readonly key: string; readonly name: string };
    const generated = data.surfaces.filter((surface) => surface.synthetic).length;
    t.diagnostic(`nikkor-z50f12: the built lens carries ${generated} generated surfaces, which the worker strips`);
    const rebuilt = binding.api.buildLens({
      ...data,
      surfaces: data.surfaces.filter((surface) => !surface.synthetic),
      elements: data.elements.filter((element) => !element.synthetic),
    });
    const options = tabRequest(binding, runtime, state);
    assert.deepEqual(tabRequest(binding, rebuilt, binding.api.prepareRuntimeState(rebuilt, 0, 0, 0)), options);
    const theirs = binding.api.computeMtf(binding.api.prepareRuntimeState(rebuilt, 0, 0, 0), options);
    const mine = (await benchmark()).get("nikkor-z50f12") as Presented;
    assertIsResult(mine.data, theirs, "nikkor-z50f12, rebuilt as the worker rebuilds it");
  },
);

test(
  "the seed of the footprint scan matters: the audit scripts' nominal pupil gives another MTF than the tab's",
  { skip, timeout: 300_000 },
  async (t) => {
    const binding = await loadLvBinding(LV_PATH);
    const runs = await benchmark();
    for (const run of ["canon-ef-135-f2l-usm", "sony-fe-400mm-f28-gm-oss", "nikon-z-mc-105f28"]) {
      const configuration = CONFIGURATIONS.find((candidate) => candidate.run === run);
      assert.ok(configuration !== undefined);
      const { runtime, state } = await stateOf(binding, configuration.key, configuration.zoomT);
      const options = tabRequest(binding, runtime, state);
      // LensVisualizer's audit scripts ask with the lens's stored nominal pupil (scripts/audit-mtf.mjs,
      // `pupilSemiDiameterMm: L.EP.epSD`): the one place this repository reads it.
      const nominal = (runtime.EP as { readonly epSD: number }).epSD;
      const audit = binding.api.computeMtf(state, { ...options, pupilSemiDiameterMm: nominal });
      const tab = binding.api.computeMtf(state, options);
      const { printed, data } = runs.get(run) as Presented;
      // What lvrtc mtf printed is the tab's, to the bit.
      assertIsResult(data, tab, run);
      const difference = largestDifference(tab, audit);
      const seeds = `${nominal} mm for ${options.pupilSemiDiameterMm} mm`;
      t.diagnostic(`${run}: seed ${seeds}: the MTF differs by up to ${formatFixed(difference, 4)}`);
      // At ed78cf40 the audit scripts' seed is 1 % to 3 % below the tab's on these three lenses, and their MTF
      // lies 0.006 to 0.008 from the tab's. How far is the lens's: it is held while the lens is the measured one.
      if (binding.fingerprint().engineClosureHash === PINNED_CLOSURE && PINNED[run]?.caseId === printed.caseId) {
        assert.notEqual(nominal, options.pupilSemiDiameterMm, run);
        assert.ok(difference > 1e-3, `${run}: ${difference}`);
      }
    }
  },
);

test(
  "the focus shift and the traced f-number are those of LensVisualizer's committed chart-regression report",
  { skip, timeout: 300_000 },
  async (t) => {
    const binding = await loadLvBinding(LV_PATH);
    const runs = await benchmark();
    const report = readFileSync(join(LV_PATH ?? "", ...CHART_REPORT.split("/")), "utf8");
    for (const [run, [tracedF, limitedBy, shift]] of Object.entries(CHART_REPORT_ROWS)) {
      const configuration = CONFIGURATIONS.find((candidate) => candidate.run === run);
      assert.ok(configuration !== undefined, run);
      const { printed, opticalCase, data } = runs.get(run) as Presented;
      const { runtime, state } = await stateOf(binding, configuration.key, configuration.zoomT);

      // The report does not ask what the tab asks: its grid cap is 256, its fields and frequencies are those of
      // the charts, and its radii are the iris and its entrance pupil unscaled (reports/mtfChartRegression.report.ts).
      // None of that enters the axial focus search or the traced aperture, which the report's own request, asked
      // here for the axis alone, shows: the two numbers are the tab's to the report's precision.
      const options = tabRequest(binding, runtime, state);
      const stop = binding.api.wideOpenStopAtZoom(configuration.zoomT, runtime);
      const geometry = binding.api.computeAnalysisFieldGeometryAtState2(0, configuration.zoomT, runtime, 0);
      const pupil = binding.api.entrancePupilAtState2(stop, 0, configuration.zoomT, runtime, geometry, 0).epSD;
      const theirs = binding.api.computeMtf(state, {
        ...options,
        maxGridSize: 256,
        frequenciesPerMm: [0, 10, 20, 30, 40, 50],
        fieldFractions: [0],
        pupilSemiDiameterMm: pupil,
        stopSemiDiameterMm: stop,
      });
      assert.ok(theirs.focus !== null && theirs.aperture !== null, run);
      assert.equal(signed(theirs.focus.appliedShiftMm), signed(data.focus.appliedShiftMm), run);
      assert.equal(theirs.aperture.tracedFNumber.toFixed(2), data.aperture.tracedFNumber.toFixed(2), run);

      const mine = [
        data.aperture.tracedFNumber.toFixed(2),
        limitOf(opticalCase, data),
        signed(data.focus.appliedShiftMm),
      ];
      // The committed report is of the lens as it was when the report was written: its row is held while the
      // engine files and the case are still the ones the figures above were measured with.
      const pinned = PINNED[run];
      if (binding.fingerprint().engineClosureHash === PINNED_CLOSURE && pinned?.caseId === printed.caseId) {
        assert.deepEqual(mine, [tracedF, limitedBy, shift], run);
      } else {
        t.diagnostic(`${run}: measured ${mine.join(", ")}; the report's row is ${tracedF}, ${limitedBy}, ${shift}`);
      }
      // The row copied here is still the one the checkout's report holds.
      const zoom = configuration.zoomT;
      const row = new RegExp(
        `^\\| \`${configuration.key}\` \\| ${zoom} \\|[^|]*\\|[^|]*\\|[^|]*\\| ${tracedF.replace(".", "\\.")} \\| ` +
          `${limitedBy} \\| ${shift.replace("+", "\\+").replace(".", "\\.")} \\|`,
        "m",
      );
      if (!row.test(report)) t.diagnostic(`${run}: ${CHART_REPORT} no longer holds the row that is copied here`);
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
  "--aperture f/8 is the tab's comparison: both radii of the wide-open request scaled by N over 8",
  { skip, timeout: 300_000 },
  async () => {
    const binding = await loadLvBinding(LV_PATH);
    const runsDir = tempDir();
    const [configuration] = CONFIGURATIONS;
    const { printed, opticalCase, data } = await present(runsDir, argsOf(configuration, "--aperture", "f/8"));
    assert.equal(printed.name, `${configuration.run}-f8`);
    const { runtime, state } = await stateOf(binding, configuration.key, configuration.zoomT);
    const wideOpen = tabRequest(binding, runtime, state);
    // MtfTab.tsx: `const scale = fNumber / COMPARISON_F_NUMBER;`, and both radii of the job times `scale`.
    const scale = binding.api.fNumberAtStopdown(0, configuration.zoomT, runtime) / 8;
    const options = {
      ...wideOpen,
      pupilSemiDiameterMm: wideOpen.pupilSemiDiameterMm * scale,
      stopSemiDiameterMm: wideOpen.stopSemiDiameterMm * scale,
    };
    assert.equal(opticalCase.conditions.stopSemiDiameter, options.stopSemiDiameterMm);
    assert.deepEqual([data.method.params.view, data.method.params.fNumber], ["f8-comparison", 8]);
    assertIsResult(data, binding.api.computeMtf(state, options), `${configuration.run} at f/8`);
    // The beam the tab traces for f/8 is slower than the one it traces wide open.
    const open = (await benchmark()).get(configuration.run) as Presented;
    assert.ok(data.aperture.tracedFNumber > open.data.aperture.tracedFNumber, String(data.aperture.tracedFNumber));

    // A lens that is not faster than f/7.95 wide open, or does not stop down to f/8, has no such comparison in the
    // tab, and the answer is the tab's reason. At ed78cf40 this zoom is f/8.2 at its long end; whatever it is
    // when this runs, the answer follows the tab's rule for it.
    const slowKey = "sony-fe-400-800-f63-8-g-oss";
    const slowLens = await stateOf(binding, slowKey, 1);
    const fNumber = binding.api.fNumberAtStopdown(0, 1, slowLens.runtime);
    const offered = fNumber < 8 - 0.05 && slowLens.runtime.maxFstop >= 8;
    const slow = await lvrtc(runsDir, "mtf", slowKey, "--zoom", "1", "--aperture", "f/8");
    assert.equal(slow.code, 0, slow.err);
    assert.match(
      slow.out,
      offered
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
        request: { method: "geometric", spectrum: "reference", focus: "design", maxGridSize: 128 },
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
        request: { method: "diffraction", spectrum: "reference", focus: "best-axial", maxGridSize: 128 },
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
      // The seed by the hook's rule, at the f-number that stop radius is the stop of.
      const state = api.prepareRuntimeState(runtime, one.focusT, 0, 0);
      const wideOpenStopSD = api.wideOpenStopAtZoom(0, runtime);
      const currentFOPEN = api.fopenAtZoom2(0, runtime);
      const geometry = api.computeAnalysisFieldGeometryAtState2(one.focusT, 0, runtime, 0);
      const baseEPSD = api.entrancePupilAtState2(wideOpenStopSD, one.focusT, 0, runtime, geometry, 0).epSD;
      const fNumber = stop === wideOpenStopSD ? currentFOPEN : (wideOpenStopSD * currentFOPEN) / stop;
      const direct = api.computeMtf(state, {
        ...one.request,
        fieldFractions: values,
        frequenciesPerMm: one.spec.frequenciesPerMm,
        pupilSemiDiameterMm: (baseEPSD * currentFOPEN) / fNumber,
        stopSemiDiameterMm: stop,
        movementActive: false,
      });
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
      assert.equal(data.method.params.pupilSemiDiameterMm, (baseEPSD * currentFOPEN) / fNumber, at);
      assert.equal(data.method.params.profile, undefined, at);
      t.diagnostic(
        `${at}: ${opticalCase.conditions.object.kind} object, shift ${formatFixed(data.focus.appliedShiftMm, 4)} mm, ` +
          `traced f/${formatFixed(data.aperture.tracedFNumber, 4)}`,
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
      const gate = api.assessMtfSupport(state, {
        method: "geometric",
        spectrum: "reference",
        focus: "design",
        pupilSemiDiameterMm,
        stopSemiDiameterMm,
        fieldFractions: spec.fields.values,
        frequenciesPerMm: spec.frequenciesPerMm,
      });
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
      const gate = api.assessMtfSupport(state, tabRequest(binding, runtime, state));
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
