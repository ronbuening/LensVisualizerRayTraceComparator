// Lenses of a bound LensVisualizer checkout as `buildLens` builds them: what the case exporter and the engine `lv`
// both start from.
import type { LvBinding } from "./binding.ts";
import type { LvCatalogEntry } from "./catalog.ts";
import { LvBindingError } from "./errors.ts";
import type { ExportProblem } from "./exportProblems.ts";
import type { LvRuntimeLens } from "./types.ts";

/** A lens of the catalog as `buildLens` built it, or why there is none. */
export type BuiltLens =
  | { readonly ok: true; readonly entry: LvCatalogEntry; readonly runtime: LvRuntimeLens }
  | { readonly ok: false; readonly problem: ExportProblem };

/** Builds the lens of a key; the same key gives the same built lens again. */
export type LensBuilder = (key: string) => Promise<BuiltLens>;

/**
 * A builder of the lenses of one bound checkout. A lens is built once, however often it is asked for. A key the
 * catalog does not hold (`unknown-lens`) and a lens file LensVisualizer cannot build (`lens-build-failed`) are
 * problems, not rejections; the builder rejects only where the binding does for another reason.
 */
export function createLensBuilder(binding: LvBinding): LensBuilder {
  const built = new Map<string, BuiltLens>();
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
      const reason = error instanceof Error ? error.message : String(error);
      return {
        ok: false,
        problem: { code: "lens-build-failed", message: `LensVisualizer cannot build the lens: ${reason}` },
      };
    }
  };
  return async (key) => {
    let lens = built.get(key);
    if (lens === undefined) built.set(key, (lens = await build(key)));
    return lens;
  };
}
