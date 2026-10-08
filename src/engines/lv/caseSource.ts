// Cases from LensVisualizer: a lens key and a run's options in, an optical case out. This is the LV half of the
// case-source seam of src/core/suite.ts, and what `lvrtc export` drives.
import type { RunOptions } from "../../contract/runSpec.ts";
import type { CaseSource, SourceAudit } from "../../core/suite.ts";
import { loadLvBinding } from "./binding.ts";
import type { LvBinding } from "./binding.ts";
import type { LvCatalogEntry } from "./catalog.ts";
import { LvBindingError } from "./errors.ts";
import { exportCase } from "./exportCase.ts";
import type { ExportCaseResult } from "./exportCase.ts";
import { problemText } from "./exportProblems.ts";
import type { ExportProblem } from "./exportProblems.ts";
import type { LvRuntimeLens } from "./types.ts";

function reasonOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/** Exports lenses of one LensVisualizer checkout, and remembers what it read for them. */
export interface LvExporter {
  /**
   * The case of the lens `key` under a run's options (`exportCase`). A key the catalog does not hold
   * (`unknown-lens`) and a lens file LensVisualizer cannot build (`lens-build-failed`) are problems like any other.
   * A lens is built once, however often it is exported. Rejects only where `exportCase` throws.
   */
  exportLens(
    key: string,
    options: Pick<RunOptions, "state" | "aperture" | "lines" | "imagePlane">,
  ): Promise<ExportCaseResult>;
  /**
   * The checkout's fingerprint now, and what has changed since the lenses were read: an engine file or an exported
   * lens's file whose bytes on disk are no longer the ones loaded, and an engine closure that is no longer the one
   * a case was stamped with, because LensVisualizer loaded more of itself after that case was built.
   */
  audit(): SourceAudit;
}

/** A lens of the catalog as `buildLens` built it, or why there is none. */
type BuiltLens =
  | { readonly ok: true; readonly entry: LvCatalogEntry; readonly runtime: LvRuntimeLens }
  | { readonly ok: false; readonly problem: ExportProblem };

/** The exporter of a bound LensVisualizer checkout. */
export function createLvExporter(binding: LvBinding): LvExporter {
  const built = new Map<string, BuiltLens>();
  const exported = new Map<string, Pick<LvCatalogEntry, "file" | "fileSha256">>();
  const stampedClosures = new Set<string>();

  const build = async (key: string): Promise<BuiltLens> => {
    let lens: Awaited<ReturnType<LvBinding["lens"]>>;
    try {
      lens = await binding.lens(key);
    } catch (error) {
      if (!(error instanceof LvBindingError && error.code === "unknown-lens")) throw error;
      return { ok: false, problem: { code: "unknown-lens", message: error.message } };
    }
    try {
      return { ok: true, entry: lens.entry, runtime: binding.api.buildLens(lens.data) };
    } catch (error) {
      const message = `LensVisualizer cannot build the lens: ${reasonOf(error)}`;
      return { ok: false, problem: { code: "lens-build-failed", message } };
    }
  };

  return {
    exportLens: async (key, options) => {
      let lens = built.get(key);
      if (lens === undefined) built.set(key, (lens = await build(key)));
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
 * `audit` gives the checkout's fingerprint (`commit`, `dirty`, `engineClosureHash`, `engineFileCount`) and what
 * changed since the cases were built; null while LensVisualizer has not been loaded.
 */
export function createLvCaseSource(lvPath: string | null): CaseSource & { audit(): SourceAudit | null } {
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

  return {
    resolve: async (run) => {
      if (run.lens.kind !== "lv") {
        return { ok: false, problems: [`a lens of kind "${run.lens.kind}" is not a LensVisualizer lens`] };
      }
      const loaded = await load();
      if ("code" in loaded) return { ok: false, problems: [problemText(loaded)] };
      const result = await loaded.exportLens(run.lens.key, run);
      return result.ok ? result : { ok: false, problems: result.problems.map(problemText) };
    },
    audit: () => exporter?.audit() ?? null,
  };
}
