// The case exporter against the real LensVisualizer. Numbers pinned here were taken at LV commit d36f44b3 and are
// canaries: when LV changes the lens or its preparation they fail and say so; they are not tolerances. Nothing is
// written into the repository or into LensVisualizer: files go to a temporary directory.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import { createExportCommand } from "../../../src/cli/commands/export.ts";
import { EXIT_OK, runCli } from "../../../src/cli/main.ts";
import type { OpticalCase, SurfaceShape } from "../../../src/contract/case.ts";
import { deriveFeatures } from "../../../src/contract/features.ts";
import type { RunOptions } from "../../../src/contract/runSpec.ts";
import { REPO_ROOT } from "../../../src/core/config.ts";
import { decodeNdArray } from "../../../src/core/numeric/ndarray.ts";
import { loadSuite } from "../../../src/core/suite.ts";
import { loadLvBinding, syntheticKind } from "../../../src/engines/lv/binding.ts";
import type { LvBinding } from "../../../src/engines/lv/binding.ts";
import { createLvCaseSource, createLvExporter } from "../../../src/engines/lv/caseSource.ts";
import { CENSUS_FILES, renderCensusMarkdown } from "../../../src/engines/lv/census.ts";
import type { ExportCensus } from "../../../src/engines/lv/census.ts";
import { EXPORT_PROBLEM_CODES, LV_GATE_PROBLEM_CODES } from "../../../src/engines/lv/exportProblems.ts";
import type { LvMtfOptions, LvPreparedState, LvRuntimeLens } from "../../../src/engines/lv/types.ts";
import { suitePath } from "../../suites/support.ts";
import { BENCHMARK_KEYS, LV_PATH, LV_UNAVAILABLE } from "./support.ts";

const skip = LV_UNAVAILABLE;
const EXPORT_PROCESS = fileURLToPath(new URL("./exportProcess.ts", import.meta.url));
const KNOWN_CODES: readonly string[] = [...EXPORT_PROBLEM_CODES, ...LV_GATE_PROBLEM_CODES];

/** Runs `lvrtc export` in this process against the repository's configuration. */
async function exportCli(args: readonly string[]): Promise<{ code: number; out: string; err: string }> {
  const out: string[] = [];
  const err: string[] = [];
  const command = createExportCommand({ rootDir: REPO_ROOT, env: process.env, cwd: REPO_ROOT });
  const code = await runCli(
    ["export", ...args],
    { stdout: (text) => void out.push(text), stderr: (text) => void err.push(text) },
    [command],
  );
  return { code, out: out.join(""), err: err.join("") };
}

/** A lens built by LensVisualizer, with the state it prepares at a zoom and focus position. */
async function prepared(
  binding: LvBinding,
  key: string,
  zoomT = 0,
  focusT = 0,
): Promise<{ runtime: LvRuntimeLens; state: LvPreparedState }> {
  const runtime = binding.api.buildLens((await binding.lens(key)).data);
  return { runtime, state: binding.api.prepareRuntimeState(runtime, focusT, zoomT) };
}

/** The case of a lens under a run's options; fails the test when it has none. */
async function exported(binding: LvBinding, key: string, options: RunOptions = {}): Promise<OpticalCase> {
  const result = await createLvExporter(binding).exportLens(key, options);
  assert.ok(result.ok, `${key}: ${JSON.stringify(result)}`);
  return result.opticalCase;
}

/** The rows of a case's index table, one per line. */
function indexRows(opticalCase: OpticalCase): Float64Array[] {
  const table = decodeNdArray(opticalCase.conditions.indexAfterSurface);
  assert.equal(table.dtype, "f8");
  const [lines, surfaces] = table.shape;
  return Array.from({ length: lines }, (_unused, row) =>
    (table.values as Float64Array).subarray(row * surfaces, (row + 1) * surfaces),
  );
}

/** The options LensVisualizer's support gate is asked with for a spectrum; the radii only have to be positive. */
function gateOptions(spectrum: string, radius: number): LvMtfOptions {
  return { method: "geometric", spectrum, pupilSemiDiameterMm: radius, stopSemiDiameterMm: radius, focus: "design" };
}

/** The sag the contract defines for a shape at a radial height: CONTRACT.md, "Sag", written out term by term. */
function contractSag(shape: SurfaceShape, r: number): number {
  if (shape.kind === "plane") return 0;
  const c = shape.radius === null ? 0 : 1 / shape.radius;
  const base = (c * r * r) / (1 + Math.sqrt(1 - (1 + shape.conic) * c * c * r * r));
  const terms = shape.kind === "asphere" ? shape.terms : [];
  return terms.reduce((sum, { power, coeff }) => sum + coeff * r ** power, base);
}

// ── The whole catalog ────────────────────────────────────────────────────────────────────────────────────────────

test("export --all completes with zero throws, and its counts add up", { skip }, async (t) => {
  const directory = mkdtempSync(join(tmpdir(), "lvrtc-census-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const run = await exportCli(["--all", "--json", "--census", directory]);
  assert.equal(run.code, EXIT_OK, run.err);
  assert.equal(run.err, "");
  const census: ExportCensus = JSON.parse(run.out);
  const binding = await loadLvBinding(LV_PATH);
  const catalog = await binding.catalog();

  assert.deepEqual(census.threw, []);
  assert.equal(census.unindexedFiles, 0);
  assert.equal(census.lenses, catalog.entries.length);
  // Every prime once and every zoom at both ends: LensVisualizer's own flag says which is which.
  const zooms = catalog.entries.filter((entry) => entry.zoom === true).map((entry) => entry.key);
  assert.equal(census.zooms, zooms.length);
  assert.equal(census.states, census.lenses + census.zooms);
  assert.equal(census.exported + census.notExportable, census.states);
  assert.deepEqual(
    [census.byState.prime.states, census.byState.wide.states, census.byState.tele.states],
    [census.lenses - census.zooms, census.zooms, census.zooms],
  );
  assert.ok(census.zooms > 250, `about 297 zooms, found ${census.zooms}`);
  assert.ok(census.exported > 1100, `about 1164 states export, found ${census.exported}`);
  assert.ok(census.byState.tele.exported > 250, `about 296 tele ends export, found ${census.byState.tele.exported}`);
  // Every state that is not exportable is under at least one reason, every reason has a known code, and the keys
  // of a reason are lenses of the catalog, sorted; a lens named with one end is a zoom.
  const keys = new Set(catalog.entries.map((entry) => entry.key));
  // The states that have a reason, each named once: a prime by its key, a zoom by its key and each end that has one.
  const withReason = new Set<string>();
  for (const [code, { states, lenses, wideOnly, teleOnly }] of Object.entries(census.reasons)) {
    assert.ok(KNOWN_CODES.includes(code), `unknown problem code ${code}`);
    assert.deepEqual(lenses, [...lenses].sort(), code);
    for (const key of lenses) {
      assert.ok(keys.has(key), key);
      if (!zooms.includes(key)) withReason.add(key);
      if (zooms.includes(key) && !teleOnly.includes(key)) withReason.add(`${key} wide`);
      if (zooms.includes(key) && !wideOnly.includes(key)) withReason.add(`${key} tele`);
    }
    const oneEnd = [...wideOnly, ...teleOnly];
    for (const key of oneEnd) assert.ok(lenses.includes(key) && zooms.includes(key), `${code}: ${key}`);
    const both = lenses.filter((key) => zooms.includes(key) && !oneEnd.includes(key));
    assert.equal(states, lenses.length + both.length, code);
  }
  const { prime, wide, tele } = census.byState;
  assert.equal(withReason.size, census.notExportable);
  for (const [end, counts] of [
    ["wide", wide],
    ["tele", tele],
  ] as const) {
    const named = [...withReason].filter((state) => state.endsWith(` ${end}`));
    assert.equal(named.length, counts.notExportable, end);
  }
  t.diagnostic(
    `${census.lenses} lenses, ${census.zooms} zooms, ${census.states} states: ${census.exported} exported, ` +
      `${census.notExportable} not exportable (primes ${prime.notExportable}, wide ${wide.notExportable}, tele ` +
      `${tele.notExportable}); by reason: ` +
      Object.entries(census.reasons)
        .map(([code, reason]) => `${code} ${reason.states} states of ${reason.lenses.length} lenses`)
        .join(", "),
  );
  for (const count of Object.values(census.features)) assert.ok(count >= 0 && count <= census.exported);
  for (const { max, lens } of Object.values(census.limits)) assert.ok(max > 0 && lens !== null && keys.has(lens));
  assert.equal(census.limits["lines.count"].max, 1, "the census is taken on the reference line");
  assert.deepEqual(census.lensVisualizer, { ...binding.fingerprint() });

  // The files are the census that was printed, and say neither where nor when they were written.
  assert.deepEqual(readdirSync(directory).sort(), [CENSUS_FILES.json, CENSUS_FILES.markdown]);
  const json = readFileSync(join(directory, CENSUS_FILES.json), "utf8");
  const markdown = readFileSync(join(directory, CENSUS_FILES.markdown), "utf8");
  assert.equal(json, run.out);
  assert.equal(markdown, renderCensusMarkdown(census));
  for (const absent of [directory, REPO_ROOT, binding.root]) {
    assert.ok(!json.includes(absent) && !markdown.includes(absent), absent);
  }
});

test(
  "every lens LensVisualizer's own MTF path covers is exported, and no lens is exported without an account",
  { skip },
  async () => {
    const binding = await loadLvBinding(LV_PATH);
    const exporter = createLvExporter(binding);
    const uncovered: string[] = [];
    const unaccounted: string[] = [];
    const uncoded: string[] = [];
    let exportedCount = 0;
    for (const { key } of (await binding.catalog()).entries) {
      const { runtime, state } = await prepared(binding, key);
      const radius = binding.api.wideOpenStopAtZoom(0, runtime);
      const support = binding.api.assessMtfSupport(state, gateOptions("reference", radius));
      const result = await exporter.exportLens(key, {});
      if (result.ok) {
        exportedCount++;
        // A lens outside LV's MTF path is exported only for what the contract expresses, and says so.
        const { features, provenance } = result.opticalCase;
        const expressed =
          features.includes("aperture.annular") ||
          (provenance.notes ?? []).some((note) => note.startsWith("projection:fisheye"));
        if (!support.available && !expressed) unaccounted.push(`${key} (${support.reason})`);
        if (!support.available && result.opticalCase.conditions.lines[0].indexSource !== "authored")
          unaccounted.push(key);
      } else {
        if (support.available) uncovered.push(`${key}: ${result.problems.map((problem) => problem.code).join(", ")}`);
        for (const problem of result.problems)
          if (!KNOWN_CODES.includes(problem.code)) uncoded.push(`${key}: ${problem.code}`);
      }
    }
    assert.deepEqual(uncovered, [], "LensVisualizer traces these for its MTF, and the exporter has no case for them");
    assert.deepEqual(unaccounted, []);
    assert.deepEqual(uncoded, []);
    assert.ok(exportedCount > 800);
  },
);

test(
  "on the photopic lines a lens is exported exactly when LensVisualizer's spectral gate passes, else under its reason",
  { skip },
  async () => {
    const binding = await loadLvBinding(LV_PATH);
    const exporter = createLvExporter(binding);
    const disagree: string[] = [];
    const wrongLight: string[] = [];
    let exportedCount = 0;
    for (const { key } of (await binding.catalog()).entries) {
      const { runtime, state } = await prepared(binding, key);
      const support = binding.api.assessMtfSupport(
        state,
        gateOptions("photopic", binding.api.wideOpenStopAtZoom(0, runtime)),
      );
      const result = await exporter.exportLens(key, { lines: { kind: "photopic" } });
      if (result.ok !== support.available)
        disagree.push(`${key}: exported ${result.ok}, LensVisualizer ${support.reason}`);
      if (result.ok) {
        exportedCount++;
        const { lines } = result.opticalCase.conditions;
        const anchored = lines.every((line) => line.indexSource === "anchored");
        if (lines.length !== 5 || lines[0].wavelengthNm !== 555 || !anchored) wrongLight.push(key);
      } else if (!support.available && support.reason !== "unsupported-path") {
        // What is not a matter of the optical path is reported under LensVisualizer's own code.
        const codes = result.problems.map((problem) => problem.code);
        if (!codes.includes(support.reason ?? "")) disagree.push(`${key}: ${codes.join(", ")} for ${support.reason}`);
      }
    }
    assert.deepEqual(disagree, []);
    assert.deepEqual(wrongLight, []);
    assert.ok(exportedCount > 700, `about 810 lenses have photopic data, found ${exportedCount}`);
  },
);

// ── One lens, member by member ───────────────────────────────────────────────────────────────────────────────────

test("nikkor-z50f12 at its default state is LensVisualizer's prepared state, member by member", { skip }, async () => {
  const binding = await loadLvBinding(LV_PATH);
  const { runtime, state } = await prepared(binding, "nikkor-z50f12");
  const opticalCase = await exported(binding, "nikkor-z50f12");
  const { system, conditions } = opticalCase;

  // Canaries taken at LV d36f44b3.
  assert.equal(system.surfaces.length, 35);
  assert.equal(system.stopIndex, 17);
  assert.equal(system.lastLensSurfaceIndex, 32);
  assert.equal(system.designImageZ, 163.306);
  assert.equal(conditions.stopSemiDiameter, 20.42354482258628);
  assert.deepEqual(opticalCase.features, ["surface.asphere.even", "surface.conic"]);
  assert.equal(deriveFeatures(system, conditions).limits["asphere.maxPower"], 16);

  // The stop index and stop radius are LensVisualizer's own values, and the stop surface carries the radius.
  assert.equal(system.stopIndex, state.lens.stop.surfaceIndex);
  assert.equal(conditions.stopSemiDiameter, state.surfaces[state.lens.stop.surfaceIndex].sd);
  assert.equal(conditions.stopSemiDiameter, binding.api.wideOpenStopAtZoom(0, runtime));
  assert.equal(system.surfaces[17].aperture.nominalSemiDiameter, conditions.stopSemiDiameter);
  assert.equal(system.lastLensSurfaceIndex, runtime.lastLensSurfaceIdx);
  assert.equal(conditions.imageZ, state.imgZ);
  assert.equal(system.designImageZ, state.imgZ);
  assert.deepEqual(conditions.object, { kind: "infinity" });

  // Every surface: the vertex, the gap, the clear aperture and the element of the prepared state.
  const last = state.surfaces.length - 1;
  system.surfaces.forEach((surface, index) => {
    const prepared = state.surfaces[index];
    const at = `surface ${index}`;
    assert.equal(surface.label, prepared.label, at);
    assert.ok(Object.is(surface.z, state.z[index]), at);
    assert.ok(Object.is(surface.thickness, prepared.d), at);
    assert.equal(surface.aperture.nominalSemiDiameter, prepared.sd, at);
    assert.equal(surface.aperture.innerSemiDiameter, 0, at);
    assert.equal(surface.elementId, prepared.elemId, at);
    assert.equal(surface.synthetic ?? null, syntheticKind(prepared), at);
    const flat = Math.abs(prepared.R) > 1e10;
    assert.equal(surface.shape.kind, prepared.asphere !== null ? "asphere" : flat ? "plane" : "conic", at);
    if (surface.shape.kind !== "plane") assert.equal(surface.shape.radius, prepared.R, at);
    if (index === last) assert.equal(prepared.z + prepared.d, state.imgZ);
  });
  // The rear plate is a real pair of flat surfaces behind the last lens surface.
  assert.deepEqual(
    system.surfaces.slice(32).map((surface) => [surface.synthetic ?? null, surface.shape.kind === "plane"]),
    [
      [null, false],
      ["rearPlate", true],
      ["rearPlate", true],
    ],
  );
  assert.deepEqual(
    system.surfaces.slice(33).map((surface) => surface.label),
    ["RP1a", "RP1b"],
  );

  // On the reference line the index table is surface.nd, bit for bit.
  assert.deepEqual(conditions.lines, [{ wavelengthNm: 587.5618, weight: 1, indexSource: "authored" }]);
  const [row, ...more] = indexRows(opticalCase);
  assert.deepEqual(more, []);
  assert.equal(row.length, 35);
  state.surfaces.forEach((surface, index) => assert.ok(Object.is(row[index], surface.nd), `surface ${index}`));

  assert.deepEqual(opticalCase.provenance.source, {
    kind: "lv-lens",
    lensKey: "nikkor-z50f12",
    file: "src/lens-data/nikon/NikonNikkorZ50f12.data.ts",
    fileSha256: (await binding.lens("nikkor-z50f12")).entry.fileSha256,
    zoomT: 0,
    focusT: 0,
  });
  const { commit, dirty, engineClosureHash } = binding.fingerprint();
  assert.deepEqual(opticalCase.provenance.lv, { commit, dirty, closureHash: engineClosureHash });
});

test(
  "every asphere term of the benchmark cases is a coefficient of the prepared state, and none is left out",
  { skip },
  async () => {
    const binding = await loadLvBinding(LV_PATH);
    for (const key of BENCHMARK_KEYS) {
      const { state } = await prepared(binding, key);
      const { system } = await exported(binding, key);
      system.surfaces.forEach((surface, index) => {
        const asphere = state.surfaces[index].asphere;
        const at = `${key}, surface ${index}`;
        if (asphere === null) return assert.notEqual(surface.shape.kind, "asphere", at);
        const authored = Object.entries(asphere).filter(([name, value]) => name !== "K" && value !== 0);
        const terms = surface.shape.kind === "asphere" ? surface.shape.terms : [];
        assert.deepEqual(terms.map(({ power, coeff }) => [`A${power}`, coeff]).sort(), authored.sort(), at);
        if (surface.shape.kind !== "plane") assert.equal(surface.shape.conic, asphere.K, at);
        // The sag the contract defines is the one LensVisualizer's own profile evaluates, at the rim.
        const sag = contractSag(surface.shape, surface.aperture.nominalSemiDiameter);
        const lv = state.surfaces[index].profile.sag(surface.aperture.nominalSemiDiameter);
        assert.ok(
          Math.abs(sag - lv) <= 1e-12 * Math.max(1, Math.abs(lv)),
          `${at}: sag ${sag} vs LensVisualizer's ${lv}`,
        );
      });
    }
  },
);

test(
  "every surface of every exported lens has the sag of LensVisualizer's own profile, from the vertex to the rim",
  { skip },
  async () => {
    const binding = await loadLvBinding(LV_PATH);
    const exporter = createLvExporter(binding);
    const wrong: string[] = [];
    const seen = { plane: 0, conic: 0, evenAsphere: 0, oddAsphere: 0, flatBaseAsphere: 0, power20: 0 };
    for (const { key } of (await binding.catalog()).entries) {
      const result = await exporter.exportLens(key, {});
      if (!result.ok) continue;
      const { state } = await prepared(binding, key);
      result.opticalCase.system.surfaces.forEach(({ shape }, index) => {
        const { profile, sd } = state.surfaces[index];
        if (shape.kind === "plane") seen.plane++;
        else if (shape.kind === "conic") seen.conic++;
        else {
          const powers = shape.terms.map((term) => term.power);
          if (powers.some((power) => power % 2 === 1)) seen.oddAsphere++;
          else seen.evenAsphere++;
          if (shape.radius === null) seen.flatBaseAsphere++;
          if (powers.includes(20)) seen.power20++;
        }
        // Nine radii, as rung R0 will ask for. The two sums add their terms in another order, and a surface that
        // is nearly a hemisphere at its rim takes the root of a small difference, so the bound is not roundoff: at
        // LV d36f44b3 the largest difference is 6.1e-12 of the sag (1.3e-10 mm), where a term left out, a wrong
        // power or a sign shows at 1e-6 or more.
        for (let step = 0; step <= 8; step++) {
          const r = (sd * step) / 8;
          const expected = profile.sag(r);
          const difference = Math.abs(contractSag(shape, r) - expected);
          if (!(difference <= 1e-10 * Math.max(1, Math.abs(expected)))) {
            wrong.push(`${key}, surface ${index} (${shape.kind}) at r = ${r}: off by ${difference}`);
          }
        }
      });
    }
    assert.deepEqual(wrong.slice(0, 20), []);
    // The catalog has every kind of shape the exporter writes, so each was compared.
    for (const [kind, count] of Object.entries(seen)) assert.ok(count > 0, `no ${kind} surface was compared`);
  },
);

// ── Lines and indices ────────────────────────────────────────────────────────────────────────────────────────────

test(
  "a photopic export has LensVisualizer's five lines and weights, and the indices of its resolver",
  { skip },
  async () => {
    const binding = await loadLvBinding(LV_PATH);
    const { runtime, state } = await prepared(binding, "nikkor-z50f12");
    const opticalCase = await exported(binding, "nikkor-z50f12", { lines: { kind: "photopic" } });
    // LensVisualizer's MTF_PHOTOPIC_LINES at d36f44b3.
    assert.deepEqual(
      opticalCase.conditions.lines.map((line) => [line.wavelengthNm, line.weight, line.indexSource]),
      [
        [555, 1, "anchored"],
        [470, 0.091, "anchored"],
        [510, 0.503, "anchored"],
        [610, 0.503, "anchored"],
        [650, 0.107, "anchored"],
      ],
    );
    const support = binding.api.assessMtfSupport(
      state,
      gateOptions("photopic", binding.api.wideOpenStopAtZoom(0, runtime)),
    );
    assert.equal(support.available, true);
    const rows = indexRows(opticalCase);
    assert.equal(rows.length, 5);
    opticalCase.conditions.lines.forEach((line, row) => {
      const resolver = binding.api.mtfIndexResolver(state, support, line.wavelengthNm);
      assert.ok(resolver !== undefined);
      state.surfaces.forEach((surface, column) => {
        const at = `${line.wavelengthNm} nm, surface ${column}`;
        assert.ok(Object.is(rows[row][column], resolver(column, surface.nd)), at);
        // Air is exactly 1 at every line; glass is dispersed, so it is not the authored index.
        assert.equal(rows[row][column] === 1, surface.nd === 1, at);
        if (surface.nd !== 1) assert.notEqual(rows[row][column], surface.nd, at);
      });
    });
    // The lines change the conditions, never the system.
    assert.equal(opticalCase.systemId, (await exported(binding, "nikkor-z50f12")).systemId);

    const cdf = await exported(binding, "nikkor-z50f12", { lines: { kind: "cdf" } });
    assert.deepEqual(
      cdf.conditions.lines.map((line) => [line.wavelengthNm, line.weight]),
      [
        [587.5618, 1 / 3],
        [656.2725, 1 / 3],
        [486.1327, 1 / 3],
      ],
    );
    // An explicit list of the same wavelengths has the same indices: both take LensVisualizer's resolver.
    const explicit = await exported(binding, "nikkor-z50f12", {
      lines: { kind: "explicit", wavelengthsNm: [587.5618, 656.2725, 486.1327], weights: [1 / 3, 1 / 3, 1 / 3] },
    });
    assert.equal(explicit.id, cdf.id);
  },
);

test("an all-e lens has the e line as its reference line, with the authored indices", { skip }, async () => {
  const binding = await loadLvBinding(LV_PATH);
  const { state } = await prepared(binding, "leica-elcan-50f2");
  const opticalCase = await exported(binding, "leica-elcan-50f2");
  assert.equal(binding.api.spectralLinesNm.e, 546.074);
  assert.deepEqual(opticalCase.conditions.lines, [{ wavelengthNm: 546.074, weight: 1, indexSource: "authored" }]);
  const [row] = indexRows(opticalCase);
  state.surfaces.forEach((surface, index) => assert.ok(Object.is(row[index], surface.nd), `surface ${index}`));
});

// ── The stop ─────────────────────────────────────────────────────────────────────────────────────────────────────

test("the stop-down rule reproduces the hook's formula, at the zoom position asked for", { skip }, async () => {
  const binding = await loadLvBinding(LV_PATH);
  for (const [key, zoomT, fNumbers] of [
    ["nikkor-z50f12", 0, [1.4, 2.8, 8]],
    ["nikon-z-24-70f4s", 0, [4, 8]],
    ["nikon-z-24-70f4s", 1, [5.6, 11]],
  ] as const) {
    const { runtime, state } = await prepared(binding, key, zoomT);
    const wideOpen = binding.api.wideOpenStopAtZoom(zoomT, runtime);
    const widest = binding.api.fopenAtZoom2(zoomT, runtime);
    assert.equal(wideOpen, state.surfaces[state.lens.stop.surfaceIndex].sd, key);
    for (const value of fNumbers) {
      const stopped = await exported(binding, key, { state: { zoomT }, aperture: { kind: "f-number", value } });
      const at = `${key} at zoom ${zoomT}, f/${value}`;
      // useLensComputation.ts: currentPhysStopSD = (wideOpenStopSD * currentFOPEN) / fNumber.
      assert.ok(Object.is(stopped.conditions.stopSemiDiameter, (wideOpen * widest) / value), at);
      const stopSurface = stopped.system.surfaces[stopped.system.stopIndex];
      assert.equal(stopSurface.aperture.nominalSemiDiameter, stopped.conditions.stopSemiDiameter, at);
      assert.ok(stopped.conditions.stopSemiDiameter < wideOpen || value === widest, at);
    }
  }
  // Faster than wide open is a problem, at the widest aperture of that zoom position.
  const { runtime } = await prepared(binding, "nikkor-z50f12");
  const widest = binding.api.fopenAtZoom2(0, runtime);
  const refused = await createLvExporter(binding).exportLens("nikkor-z50f12", {
    aperture: { kind: "f-number", value: widest - 0.01 },
  });
  assert.ok(!refused.ok);
  assert.deepEqual(
    refused.problems.map((problem) => problem.code),
    ["aperture-faster-than-wide-open"],
  );
});

test(
  "every clip radius of the benchmark cases is LensVisualizer's inclusive limit: it passes there, and not above",
  { skip },
  async () => {
    const binding = await loadLvBinding(LV_PATH);
    const view = new DataView(new ArrayBuffer(8));
    const nextUp = (value: number): number => {
      view.setFloat64(0, value);
      view.setBigUint64(0, view.getBigUint64(0) + 1n);
      return view.getFloat64(0);
    };
    for (const key of BENCHMARK_KEYS) {
      const { state } = await prepared(binding, key);
      const { system, conditions } = await exported(binding, key, { aperture: { kind: "f-number", value: 8 } });
      system.surfaces.forEach((surface, index) => {
        const at = `${key}, surface ${index}`;
        const { semiDiameter: limit, nominalSemiDiameter: nominal } = surface.aperture;
        const stop = index === system.stopIndex ? conditions.stopSemiDiameter : undefined;
        assert.equal(nominal, stop ?? state.surfaces[index].sd, at);
        // LensVisualizer's rule at d36f44b3 (trace/aperture.ts, exceedsAperture).
        assert.equal(limit, nominal + Math.max(1e-9, nominal * 1e-12), at);
        const evaluate = (radius: number) => binding.api.evaluateAperture(state, state.surfaces[index], radius, stop);
        assert.equal(evaluate(limit).state, "inside", at);
        assert.equal(evaluate(nextUp(limit)).state, "outside", at);
      });
    }
  },
);

// ── Conjugates ───────────────────────────────────────────────────────────────────────────────────────────────────

test(
  "a certified finite station is exported with LensVisualizer's object point; any other focus is refused",
  { skip },
  async () => {
    const binding = await loadLvBinding(LV_PATH);
    const key = "sigma-105mm-f28-dg-dn-macro-art";
    const stations = (await binding.lens(key)).data.finiteConjugates as { focusT: number; zoomT: number }[];
    assert.ok(Array.isArray(stations) && stations.length > 0, "the lens documents finite conjugates");
    for (const { focusT, zoomT } of stations) {
      const { runtime, state } = await prepared(binding, key, zoomT, focusT);
      const options: RunOptions = { state: { zoomT, focus: { kind: "focusT", value: focusT } } };
      const opticalCase = await exported(binding, key, options);
      const support = binding.api.assessMtfSupport(
        state,
        gateOptions("reference", binding.api.wideOpenStopAtZoom(zoomT, runtime)),
      );
      assert.ok(support.conjugate !== undefined, `focus ${focusT}`);
      const point = binding.api.mtfFiniteObjectPoint(state, support.conjugate, 0);
      assert.ok(point !== null);
      assert.deepEqual(opticalCase.conditions.object, { kind: "finite", z: point[2] });
      assert.ok(point[2] < 0);
      assert.equal(opticalCase.label.focusT, focusT);
      assert.ok(opticalCase.features.includes("object.finite"));
      assert.equal(opticalCase.system.designImageZ, state.imgZ);
    }
    const between = await createLvExporter(binding).exportLens(key, {
      state: { focus: { kind: "focusT", value: 0.123 } },
    });
    assert.ok(!between.ok);
    assert.deepEqual(
      between.problems.map((problem) => problem.code),
      ["finite-conjugate-unavailable"],
    );
  },
);

// ── Identity across processes ────────────────────────────────────────────────────────────────────────────────────

test("the case id of every benchmark configuration is the same in two separate processes", { skip }, async () => {
  const inProcess = (cwd: string, lvPath: string): { suite: string; runs: Record<string, unknown> } =>
    JSON.parse(
      execFileSync(process.execPath, [EXPORT_PROCESS, lvPath, suitePath("benchmark")], { encoding: "utf8", cwd }),
    );
  const first = inProcess(REPO_ROOT, LV_PATH ?? "");
  // The second process is started elsewhere and names the checkout another way: neither is part of the identity.
  const second = inProcess(tmpdir(), join(LV_PATH ?? "", "src", ".."));
  assert.deepEqual(second, first);
  // 12 configurations on two sets of lines, in four conditions: the stop of the tab's f/8 comparison and
  // LensVisualizer's best axial focus, which is found by its own search, are the same numbers in every process.
  assert.equal(Object.keys(first.runs).length, 96);
  for (const [name, id] of Object.entries(first.runs)) assert.match(String(id), /^[0-9a-f]{64}$/, name);
  assert.equal(new Set(Object.values(first.runs)).size, 96, "96 runs, 96 cases");

  // This process, which has by now exported the whole catalog, gives the same ids.
  const sources = { lv: createLvCaseSource(LV_PATH) };
  const suite = await loadSuite(suitePath("benchmark"), { rootDir: REPO_ROOT, sources });
  assert.equal(suite.hash, first.suite);
  assert.deepEqual(Object.fromEntries(suite.runs.map((run) => [run.spec.name, run.opticalCase?.id])), first.runs);
  assert.deepEqual(sources.lv.audit()?.changed, []);
});
