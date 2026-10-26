// Cases from LensVisualizer: a lens key and a run's options in, an optical case out. This is the LV half of the
// case-source seam of src/core/suite.ts, and what `lvrtc export` drives.
import type { OpticalCase } from "../../contract/case.ts";
import type { RunSpec, RunOptions } from "../../contract/runSpec.ts";
import { recipeProblem } from "../../core/mtfRecipe.ts";
import type { MtfRecipeResolution } from "../../core/mtfRecipe.ts";
import type { CaseResolution, CaseSource, RunRaySets, SourceAudit } from "../../core/suite.ts";
import { rayProblem } from "../../rays/raySets.ts";
import type { RaySetResolution } from "../../rays/raySets.ts";
import type { SpotSetResolution } from "../../rays/spotSets.ts";
import { loadLvBinding } from "./binding.ts";
import type { LvBinding } from "./binding.ts";
import { STALE_CASE, rebuildCase } from "./caseModel.ts";
import type { LvCatalogEntry } from "./catalog.ts";
import { LvBindingError } from "./errors.ts";
import { exportCase } from "./exportCase.ts";
import type { ExportCaseResult } from "./exportCase.ts";
import { problemText } from "./exportProblems.ts";
import type { ExportProblem } from "./exportProblems.ts";
import { createLensBuilder } from "./lensBuilder.ts";
import { lvRaySets } from "./raySets.ts";
import { lvSpotRaySets } from "./spotRaySets.ts";
import { lvMtfRecipe } from "./recipe.ts";
import { expandLvStations, stationSelectionProblem } from "./stations.ts";
import { ZOOM_ENDS } from "./zoomEnds.ts";
import { confirmFoldedPath } from "./confirmPath.ts";

/** Exports lenses of one LensVisualizer checkout, and remembers what it read for them. */
export interface LvExporter {
  /** Run-only confirmation after the actual requested coarse/fine sets have been generated. */
  confirmRaySets(run: RunSpec, opticalCase: OpticalCase, sets: RunRaySets): Promise<CaseResolution>;
  catalogKeys(): Promise<readonly string[]>;
  /** Source-owned opt-in station expansion; ordinary runs remain ordinary. */
  expandStations(run: RunSpec): Promise<readonly RunSpec[]>;
  /**
   * The case of the lens `key` under a run's options (`exportCase`). A key the catalog does not hold
   * (`unknown-lens`) and a lens file LensVisualizer cannot build (`lens-build-failed`) are problems like any other.
   * A lens is built once, however often it is exported. Rejects only where `exportCase` throws.
   */
  exportLens(
    key: string,
    options: Pick<RunOptions, "state" | "aperture" | "lines" | "imagePlane" | "sampling">,
  ): Promise<ExportCaseResult>;
  /**
   * Whether the lens `key` is a zoom, as the catalog indexes it (`LvCatalogEntry.zoom`); false for a key the
   * catalog does not hold. Nothing is built for the answer.
   */
  isZoom(key: string): Promise<boolean>;
  /**
   * The ray sets of a case this checkout exported, under a run's fields and sampling: LensVisualizer's own launch
   * rays (`lvRaySets`), from the state the case was exported from, which is rebuilt and held to the case first
   * (`rebuildCase`). A case that is no longer what LensVisualizer gives has no rays, and the one problem
   * `stale-case`. Rejects for a case that did not come from a LensVisualizer lens.
   */
  raySets(opticalCase: OpticalCase, options: Pick<RunOptions, "fields" | "sampling">): Promise<RaySetResolution>;
  /**
   * The spot sets of a case this checkout exported: the rays LensVisualizer's coma and bokeh tabs launch and the
   * engines' own spot requests of the same tabs (`lvSpotRaySets`), from the state the case was exported from,
   * rebuilt and held to the case first. A stale case has none, and the one problem `stale-case`.
   */
  spotRaySets(opticalCase: OpticalCase): Promise<SpotSetResolution>;
  /**
   * The MTF recipe of a case this checkout exported, under a run's fields, frequencies and grid cap
   * (`lvMtfRecipe`), from the state the case was exported from, rebuilt and held to the case first. A case that is
   * no longer what LensVisualizer gives has no recipe, and the one problem `stale-case`.
   */
  recipe(
    opticalCase: OpticalCase,
    options: Pick<RunOptions, "fields" | "frequenciesPerMm" | "sampling">,
  ): Promise<MtfRecipeResolution>;
  /**
   * The checkout's fingerprint now, and what has changed since the lenses were read: an engine file or an exported
   * lens's file whose bytes on disk are no longer the ones loaded, and an engine closure that is no longer the one
   * a case was stamped with, because LensVisualizer loaded more of itself after that case was built.
   */
  audit(): SourceAudit;
}

/** The exporter of a bound LensVisualizer checkout. */
export function createLvExporter(binding: LvBinding): LvExporter {
  const build = createLensBuilder(binding);
  const exported = new Map<string, Pick<LvCatalogEntry, "file" | "fileSha256">>();
  const stampedClosures = new Set<string>();

  return {
    confirmRaySets: async (run, opticalCase, sets) => {
      if (opticalCase.system.opticalPath === undefined) return { ok: true, opticalCase };
      const rebuilt = await rebuildCase(binding, build, opticalCase);
      if (!rebuilt.ok) return { ok: false, problems: [rayProblem(STALE_CASE, rebuilt.reason)] };
      return confirmFoldedPath(binding.api, { ...rebuilt.model, exported: opticalCase }, run, sets);
    },
    catalogKeys: async () => (await binding.catalog()).entries.map((entry) => entry.key),
    expandStations: (run) => expandLvStations(run, binding, build),
    exportLens: async (key, options) => {
      const lens = await build(key);
      if (!lens.ok) return { ok: false, problems: [lens.problem] };
      const { commit, dirty, engineClosureHash } = binding.fingerprint();
      const result = exportCase({
        api: binding.api,
        lens: lens.entry,
        runtime: lens.runtime,
        options,
        lv: { commit, dirty, closureHash: engineClosureHash },
      });
      if (result.ok) {
        exported.set(lens.entry.file, lens.entry);
        stampedClosures.add(engineClosureHash);
      }
      return result;
    },
    isZoom: async (key) => {
      try {
        return (await binding.lens(key)).entry.zoom === true;
      } catch (error) {
        if (error instanceof LvBindingError && error.code === "unknown-lens") return false;
        throw error;
      }
    },
    raySets: async (opticalCase, options) => {
      const rebuilt = await rebuildCase(binding, build, opticalCase);
      if (!rebuilt.ok) return { sets: [], problems: [rayProblem(STALE_CASE, rebuilt.reason)] };
      return lvRaySets(binding.api, rebuilt.model, options);
    },
    spotRaySets: async (opticalCase) => {
      const rebuilt = await rebuildCase(binding, build, opticalCase);
      if (!rebuilt.ok) return { sets: [], problems: [rayProblem(STALE_CASE, rebuilt.reason)], asks: [] };
      return lvSpotRaySets(binding.api, rebuilt.model);
    },
    recipe: async (opticalCase, options) => {
      const rebuilt = await rebuildCase(binding, build, opticalCase);
      if (!rebuilt.ok) return { recipe: null, problems: [recipeProblem(STALE_CASE, rebuilt.reason)] };
      return lvMtfRecipe(binding.api, rebuilt.model, options);
    },
    audit: () => {
      const { commit, dirty, engineClosureHash, engineFileCount } = binding.fingerprint();
      const grown = [...stampedClosures].some((stamped) => stamped !== engineClosureHash);
      return {
        fingerprint: { commit, dirty, engineClosureHash, engineFileCount },
        changed: [
          ...(grown ? ["the engine closure (LensVisualizer loaded more files after a case was built)"] : []),
          ...binding.rehash(),
          ...binding.changedLensFiles([...exported.values()]),
        ],
      };
    },
  };
}

/** Why LensVisualizer could not be bound, as a problem of every run that names one of its lenses. */
function unavailable(error: LvBindingError): ExportProblem {
  // The binding's own message names the path, which a recorded problem must not.
  const message =
    error.code === "not-configured"
      ? "LensVisualizer is not configured: set lvPath in lvrtc.local.json or LVRTC_LV_PATH"
      : "LensVisualizer cannot be loaded; lvrtc doctor says why";
  return { code: `lv-${error.code}`, message };
}

/**
 * The case source of `{ kind: "lv", key }`: the lens of that key in the LensVisualizer checkout at `lvPath`, in the
 * state, at the aperture, on the lines and at the image plane the run asks for (`exportCase`).
 *
 * LensVisualizer is loaded when the first run asks for a lens, once. A checkout that is not configured or cannot be
 * loaded is the problem of every such run, with the code `lv-<why>` (`LvBindingErrorCode`), and no rejection; so is
 * a key the catalog does not hold, and everything `exportCase` reports. Each problem reads `<code>: <message>`.
 *
 * `expand` is the rule of the zoom: a run that states no zoom position (`state.zoomT`) of a lens LensVisualizer
 * indexes as a zoom stands for two runs, `<name>-wide` at zoom 0 and `<name>-tele` at zoom 1, alike in everything
 * else. A run that states a position, a run of a prime, and a run whose lens cannot be looked up (no checkout, an
 * unknown key) stand for themselves, and `resolve` says what is wrong with the last.
 *
 * `raySets` gives the rays of a case it resolved: LensVisualizer's own launch lattice for each field of the run, at
 * each line of the case (`lvRaySets`).
 *
 * `spotRaySets` gives the spot sets of a case it resolved: the rays of LensVisualizer's coma and bokeh tabs, and
 * the engines' own spot requests of the same tabs (`lvSpotRaySets`).
 *
 * `recipe` gives the MTF recipe of a case it resolved: the plane, the fields and the frequencies as LensVisualizer
 * resolves them (`lvMtfRecipe`).
 *
 * `audit` gives the checkout's fingerprint (`commit`, `dirty`, `engineClosureHash`, `engineFileCount`) and what
 * changed since the cases were built; null while LensVisualizer has not been loaded.
 */
export function createLvCaseSource(lvPath: string | null): Required<CaseSource> {
  let loading: Promise<LvExporter | ExportProblem> | undefined;
  let exporter: LvExporter | undefined;
  const load = (): Promise<LvExporter | ExportProblem> =>
    (loading ??= loadLvBinding(lvPath).then(
      (binding) => (exporter = createLvExporter(binding)),
      (error: unknown) => {
        if (error instanceof LvBindingError) return unavailable(error);
        throw error;
      },
    ));

  const expand: Required<CaseSource>["expand"] = async (run) => {
    if (run.lens.kind !== "lv") return [run];
    if (run.lens.stations && stationSelectionProblem(run)) return [run];
    if (!run.lens.stations && run.lens.key !== "*" && run.state?.zoomT !== undefined) return [run];
    const loaded = await load();
    if ("code" in loaded) return [run];
    if (run.lens.stations) return loaded.expandStations(run);
    if (run.lens.key === "*") {
      const selected: RunSpec[] = [];
      for (const key of await loaded.catalogKeys()) {
        selected.push(...(await expand({ ...run, name: `${run.name}-${key}`, lens: { kind: "lv", key } })));
      }
      return selected.length ? selected : [run];
    }
    if (!(await loaded.isZoom(run.lens.key))) return [run];
    return ZOOM_ENDS.map(({ end, zoomT }) => ({
      ...run,
      name: `${run.name}-${end}`,
      state: { ...run.state, zoomT },
    }));
  };
  return {
    expand,
    resolve: async (run) => {
      if (run.lens.kind !== "lv") {
        return { ok: false, problems: [`a lens of kind "${run.lens.kind}" is not a LensVisualizer lens`] };
      }
      const loaded = await load();
      if ("code" in loaded) return { ok: false, problems: [problemText(loaded)] };
      const conflict = stationSelectionProblem(run);
      if (conflict) return { ok: false, problems: [conflict] };
      if (run.lens.stations)
        return { ok: false, problems: ["no-certified-stations: the station selection gave no states"] };
      const result = await loaded.exportLens(run.lens.key, run);
      return result.ok ? result : { ok: false, problems: result.problems.map(problemText) };
    },
    raySets: async (run, opticalCase) => {
      const loaded = await load();
      if ("code" in loaded) return { sets: [], problems: [problemText(loaded)] };
      return loaded.raySets(opticalCase, run);
    },
    confirmRaySets: async (run, opticalCase, sets) => {
      const loaded = await load();
      if ("code" in loaded) return { ok: false, problems: [problemText(loaded)] };
      return loaded.confirmRaySets(run, opticalCase, sets);
    },
    spotRaySets: async (_run, opticalCase) => {
      const loaded = await load();
      if ("code" in loaded) return { sets: [], problems: [problemText(loaded)], asks: [] };
      return loaded.spotRaySets(opticalCase);
    },
    recipe: async (run, opticalCase) => {
      const loaded = await load();
      if ("code" in loaded) return { recipe: null, problems: [problemText(loaded)] };
      return loaded.recipe(opticalCase, run);
    },
    audit: () => exporter?.audit() ?? null,
  };
}
