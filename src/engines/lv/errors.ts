/**
 * Why LensVisualizer could not be bound, or a lens could not be loaded from it:
 *
 * - `not-configured`: no `lvPath` is set;
 * - `path-missing`: `lvPath` is not a directory;
 * - `not-lv-checkout`: the directory holds no `src/optics/buildLens.ts`;
 * - `loader-conflict`: this process already loads another LensVisualizer tree;
 * - `import-failed`: a module of the import manifest could not be imported; exports missing from the modules that
 *   were imported are listed with it;
 * - `exports-missing`: a module was imported and lacks an export, or the export is not of the expected kind;
 * - `unknown-lens`: the catalog holds no lens of the key asked for.
 */
export type LvBindingErrorCode =
  | "not-configured"
  | "path-missing"
  | "not-lv-checkout"
  | "loader-conflict"
  | "import-failed"
  | "exports-missing"
  | "unknown-lens";

/** A failure to bind LensVisualizer, with a code that says which; `details` lists every module or export at fault. */
export class LvBindingError extends Error {
  readonly code: LvBindingErrorCode;
  readonly details: readonly string[];

  constructor(code: LvBindingErrorCode, message: string, details: readonly string[] = [], options?: ErrorOptions) {
    super(message, options);
    this.name = "LvBindingError";
    this.code = code;
    this.details = details;
  }
}
