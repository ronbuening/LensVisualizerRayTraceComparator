// RunSpec and Suite: types mirroring contract/schema/v1/run-spec.schema.json and suite.schema.json, and the
// expansion of a suite into its runs.
import type { JsonObject } from "./json.ts";

/**
 * The lens of a run: a LensVisualizer lens by catalog key, or an optical-case file by path. A relative path is
 * resolved against the repository root.
 */
export type RunLens =
  { readonly kind: "lv"; readonly key: string } | { readonly kind: "fixture"; readonly path: string };

/** The lens's state: zoom position and focus, each 0..1 on LensVisualizer's own sliders. */
export interface RunState {
  readonly zoomT?: number;
  readonly focus?: { readonly kind: "infinity" } | { readonly kind: "focusT"; readonly value: number };
}

/** The aperture: wide open, an f-number by LensVisualizer's rule, or a stop radius in mm. */
export type RunAperture =
  | { readonly kind: "wide-open" }
  | { readonly kind: "f-number"; readonly value: number }
  | { readonly kind: "stop-radius"; readonly mm: number };

/**
 * The spectral lines: a named set, or explicit wavelengths. `weights`, when given, has one entry per wavelength;
 * without it the lines weigh the same.
 */
export type RunLines =
  | { readonly kind: "reference" | "cdf" | "photopic" }
  | { readonly kind: "explicit"; readonly wavelengthsNm: readonly number[]; readonly weights?: readonly number[] };

/**
 * The field points: fractions 0..1 of the full image height, resolved to angles by the case source, or field
 * angles in degrees, where a positive angle is an object toward +y.
 */
export type RunFields =
  | { readonly kind: "image-height-fractions"; readonly values: readonly number[] }
  | { readonly kind: "angles-deg"; readonly values: readonly number[] };

/** The image plane: the design plane, LensVisualizer's best axial focus, or the design plane moved `mm` along +z. */
export type RunImagePlane =
  { readonly kind: "design" | "lv-best-axial" } | { readonly kind: "shift"; readonly mm: number };

/** Sampling: LensVisualizer's pupil grid cap, the ray bundle grid, and options only the named engine reads. */
export interface RunSampling {
  readonly lvGridCap?: 32 | 64 | 128 | 256;
  readonly bundleGrid?: number;
  readonly engines?: { readonly [engineId: string]: JsonObject };
}

/** Everything about a run that a suite can default. An option left out takes the comparator's own default. */
export interface RunOptions {
  readonly state?: RunState;
  readonly aperture?: RunAperture;
  readonly lines?: RunLines;
  readonly fields?: RunFields;
  readonly imagePlane?: RunImagePlane;
  /** Spatial frequencies, cycles/mm. */
  readonly frequenciesPerMm?: readonly number[];
  readonly sampling?: RunSampling;
  readonly rungs?: readonly string[];
  readonly engines?: readonly string[];
  readonly referenceEngine?: string;
}

/** One lens in one state and everything to compute for it. */
export interface RunSpec extends RunOptions {
  readonly contract: string;
  readonly kind: "run-spec";
  readonly name: string;
  readonly lens: RunLens;
}

/** A run as written inside a suite: a RunSpec whose `contract` and `kind` may be left out. */
export interface SuiteRun extends RunOptions {
  readonly contract?: string;
  readonly kind?: "run-spec";
  readonly name: string;
  readonly lens: RunLens;
}

/** A named list of runs with shared defaults. */
export interface Suite {
  readonly contract: string;
  readonly kind: "suite";
  readonly name: string;
  readonly defaults?: RunOptions;
  readonly runs: readonly SuiteRun[];
}

/**
 * The rule of a run's options that their schema cannot state, as a list of what is broken (empty when nothing is):
 * explicit lines that give `weights` give one for each wavelength. It applies to a RunSpec, to a run of a suite and
 * to a suite's defaults alike. The options are expected to be schema-valid.
 */
export function runInvariantProblems(options: RunOptions): string[] {
  const { lines } = options;
  if (lines?.kind !== "explicit" || lines.weights === undefined) return [];
  if (lines.weights.length === lines.wavelengthsNm.length) return [];
  return [`lines states ${lines.weights.length} weights for ${lines.wavelengthsNm.length} wavelengths`];
}

// A record, so that the compiler refuses this file when an option is added to RunOptions and not listed here.
const RUN_OPTION_ORDER: Readonly<Record<keyof RunOptions, true>> = {
  state: true,
  aperture: true,
  lines: true,
  fields: true,
  imagePlane: true,
  frequenciesPerMm: true,
  sampling: true,
  rungs: true,
  engines: true,
  referenceEngine: true,
};

/** Every option of `RunOptions`, in the order `expandSuite` writes them. */
export const RUN_OPTION_KEYS = Object.keys(RUN_OPTION_ORDER) as readonly (keyof RunOptions)[];

type Writable<T> = { -readonly [K in keyof T]: T[K] };

function setOption<K extends keyof RunOptions>(target: Writable<RunOptions>, key: K, value: RunOptions[K]): void {
  if (value !== undefined) target[key] = value;
}

/**
 * The runs of a suite as complete RunSpecs, in suite order. Each option is the run's own value when the run states
 * one, else the suite default: an option is replaced whole, never merged into. `contract` is the run's own when it
 * states one, else the suite's. Throws when two runs share a name. The suite is expected to be schema-valid, and
 * then every RunSpec returned is too.
 */
export function expandSuite(suite: Suite): RunSpec[] {
  const names = new Set<string>();
  return suite.runs.map((run) => {
    if (names.has(run.name)) throw new Error(`suite ${suite.name}: more than one run is named "${run.name}"`);
    names.add(run.name);
    const options: Writable<RunOptions> = {};
    for (const key of RUN_OPTION_KEYS) setOption(options, key, run[key] ?? suite.defaults?.[key]);
    return { contract: run.contract ?? suite.contract, kind: "run-spec", name: run.name, lens: run.lens, ...options };
  });
}
