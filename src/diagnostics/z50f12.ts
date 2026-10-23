// Stage 4.2 only: recipes and result-only diagnostics. No prescription or engine import is copied here.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { OpticalCase } from "../contract/case.ts";
import type { MtfNativeData, MtfNativeSpec } from "../contract/quantities/mtfNative.ts";
import type { Suite } from "../contract/runSpec.ts";
import type { RunManifest } from "../core/manifest.ts";
import { decodeNdArray } from "../core/numeric/ndarray.ts";
import { createResultStore } from "../core/resultStore.ts";
import { loadLvBinding } from "../engines/lv/binding.ts";
import { rebuildCase } from "../engines/lv/caseModel.ts";
import { createLensBuilder } from "../engines/lv/lensBuilder.ts";
import { lvFieldRays, lvLaunchSetup } from "../engines/lv/raySets.ts";

export const LEVELS = [
  { name: "a", fftRays: 128, bundleGrid: 32, wavefrontGrids: [64, 128] },
  { name: "b", fftRays: 256, bundleGrid: 64, wavefrontGrids: [128, 256] },
  { name: "c", fftRays: 512, bundleGrid: 128, wavefrontGrids: [256, 512] },
] as const;

/** Keep the benchmark's four conditions, reference line and default frequency recipe verbatim. */
export function investigationSuite(benchmark: Suite): Suite {
  const runs = benchmark.runs.filter(
    (r) => r.lens.kind === "lv" && r.lens.key === "nikkor-z50f12" && r.lines?.kind === "reference",
  );
  if (runs.length !== 4) throw new Error("expected the benchmark's four reference-line Z 50/1.2 conditions");
  return {
    contract: "1.0",
    kind: "suite",
    name: "z50f12-investigation",
    defaults: { ...benchmark.defaults, rungs: ["r6c"] },
    runs: runs.flatMap((run) =>
      LEVELS.map((level) => ({
        ...run,
        name: `${run.name}-${level.name}`,
        sampling: {
          engines: {
            optiland: { fftRays: level.fftRays },
            wave: { bundleGrid: level.bundleGrid },
            "optiland-wave": { wavefrontGrids: [...level.wavefrontGrids] },
          },
        },
      })),
    ),
  };
}

/** Lit cell centers and adjacent tangential pairs, with no fictitious disc fitted to the mask. */
export function pupilSummary(
  columns: number,
  rows: number,
  samples: readonly { row: number; column: number; y: number; cosine: number }[],
) {
  if (!samples.length) throw new Error("no lit samples");
  const cells = new Map(samples.map((s) => [s.row * columns + s.column, s]));
  const pitches: number[] = [];
  for (const sample of samples) {
    const next = sample.row + 1 < rows ? cells.get((sample.row + 1) * columns + sample.column) : undefined;
    if (next) pitches.push(Math.abs(next.cosine - sample.cosine));
  }
  pitches.sort((a, b) => a - b);
  const span = (values: number[]) => [Math.min(...values), Math.max(...values)];
  // Reduce rather than spread: the fine pupil has more samples than the argument limit of Math.min.
  const extent = (read: (s: (typeof samples)[number]) => number) =>
    samples.reduce(([lo, hi], s) => [Math.min(lo, read(s)), Math.max(hi, read(s))], [Infinity, -Infinity]);
  return {
    columns,
    rows,
    lit: samples.length,
    y: extent((s) => s.y),
    cosine: extent((s) => s.cosine),
    pitch: pitches.length
      ? [...span([pitches[0], pitches.at(-1) as number]), pitches[Math.floor(pitches.length / 2)]]
      : [],
  };
}

export function readInvestigation(directory: string) {
  const manifest = JSON.parse(
    readFileSync(join(directory, "z50f12-investigation/manifest.json"), "utf8"),
  ) as RunManifest;
  const store = createResultStore(join(directory, "store"));
  const answer = (run: string, engine: string) => {
    const job = manifest.jobs.find((j) => j.run === run && j.engine === engine && j.rung === "r6c");
    if (job?.storeKey == null) throw new Error(`no stored answer: ${run} ${engine}`);
    const entry = store.get(job.storeKey);
    if (entry.kind !== "hit" || entry.entry.result.status !== "ok")
      throw new Error(`not an ok answer: ${run} ${engine}`);
    return { data: entry.entry.result.data as MtfNativeData, spec: entry.entry.request.spec as MtfNativeSpec };
  };
  return { manifest, answer };
}

/** All requested frequencies, both cuts, both off-axis fields, four methods; flags never disappear. */
export function investigationTable(directory: string): string {
  const { manifest, answer } = readInvestigation(directory);
  const out: string[] = [];
  const fmt = (v: number) => (Number.isFinite(v) ? v.toFixed(6) : "—");
  for (const run of manifest.runs.filter((r) => r.name.endsWith("-a"))) {
    const base = run.name.slice(0, -2);
    out.push(
      `### ${base}`,
      "",
      "| Field | Cut | cycles/mm | lv | wave 64 / 128 / 256 | optiland 128 / 256 / 512 | optiland-wave 128 / 256 / 512 |",
      "|---:|---|---:|---:|---|---|---|",
    );
    for (const field of [0.5, 1])
      for (const cut of ["sagittal", "tangential"] as const) {
        const spec = answer(run.name, "lv").spec;
        for (const [index, frequency] of spec.frequenciesPerMm.entries()) {
          const values = ["lv", "wave", "optiland", "optiland-wave"].map((engine) => {
            const levels = engine === "lv" ? LEVELS.slice(0, 1) : LEVELS;
            return levels
              .map(({ name }) => {
                const data = answer(`${base}-${name}`, engine).data.fields.find((f) => f.field === field);
                if (!data) throw new Error(`missing field ${field}`);
                return fmt(decodeNdArray(data[cut]).values[index]) + (data.status === "unconverged" ? "*" : "");
              })
              .join(" / ");
          });
          out.push(`| ${field} | ${cut === "sagittal" ? "S" : "T"} | ${frequency} | ${values.join(" | ")} |`);
        }
      }
    out.push("");
  }
  return out.join("\n");
}

/** Fixed-grid LV sheared values supplement, rather than replace, the adaptive product column. */
export async function lvGridDiagnostic(directory: string, lvPath: string | null) {
  const { manifest, answer } = readInvestigation(directory);
  const binding = await loadLvBinding(lvPath);
  try {
    const build = createLensBuilder(binding);
    const output = [];
    for (const run of manifest.runs.filter((r) => r.name.endsWith("-a"))) {
      const opticalCase = JSON.parse(
        readFileSync(join(directory, "z50f12-investigation/cases", `${run.caseId}.json`), "utf8"),
      ) as OpticalCase;
      const rebuilt = await rebuildCase(binding, build, opticalCase);
      if (!rebuilt.ok) throw new Error(rebuilt.reason);
      const { model } = rebuilt;
      const setup = lvLaunchSetup(binding.api, model);
      if ("problem" in setup) throw new Error(setup.problem);
      const product = answer(run.name, "lv");
      for (const field of product.data.fields.filter((f) => f.field !== 0)) {
        if (field.fieldAngleDeg === null) throw new Error("no field angle");
        for (const size of [32, 64, 128, 256]) {
          const rays = lvFieldRays(binding.api, model, setup, field.fieldAngleDeg, size);
          if ("problem" in rays) throw new Error(rays.problem);
          const bundle = binding.api.traceMtfBundle(
            model.state,
            setup.options,
            setup.support,
            rays.launch,
            rays.footprint,
            size,
            setup.support.spectralLines[0],
            opticalCase.conditions.imageZ,
          );
          if (!bundle || Object.values(bundle.openBorders).some(Boolean)) throw new Error("missing or open bundle");
          const otf = binding.api.shearedOtf(
            bundle,
            bundle.chief,
            opticalCase.conditions.lines[0].wavelengthNm * 1e-6,
            product.spec.frequenciesPerMm,
          );
          const modulus = (cut: typeof otf.sagittal) => cut.real.map((real, i) => Math.hypot(real, cut.imaginary[i]));
          output.push({
            run: run.name.slice(0, -2),
            field: field.field,
            size,
            launchStepMm: rays.grid.step,
            pupil: pupilSummary(
              bundle.columns,
              bundle.rows,
              bundle.rays
                .filter((r) => r.weight > 0)
                .map((r) => ({
                  row: r.row,
                  column: r.column,
                  y: rays.grid.y0 + (r.row + 0.5) * rays.grid.step,
                  cosine: r.trace.finalMedium * r.trace.terminalDirection[1],
                })),
            ),
            sagittal: modulus(otf.sagittal),
            tangential: modulus(otf.tangential),
          });
        }
      }
    }
    if (binding.rehash().length) throw new Error("LV changed");
    return { fingerprint: binding.fingerprint(), fields: output };
  } finally {
    binding.close();
  }
}
