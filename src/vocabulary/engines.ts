// The built-in engines, in plain words. Each `id` is the one suites, run records and baselines store since the rename
// of Stage 9.8, and `oldId` the one it had before, which the catalog snapshot and files written before the rename still
// name (LensVisualizer and optiland kept theirs: `oldId` is `id`).

/** One built-in engine. */
export interface EngineText {
  /** The id stored in suites, run records and baselines today. */
  readonly id: string;
  /** The id it had before the rename (Stage 9.8), the same where it was not renamed. */
  readonly oldId: string;
  readonly name: string;
  readonly description: string;
}

/** Every built-in engine (`src/engines/builtin.ts`). */
export const ENGINES: readonly EngineText[] = [
  {
    id: "lv",
    oldId: "lv",
    name: "LensVisualizer",
    description:
      "LensVisualizer itself, loaded from a local checkout, asked for each figure as its own tabs ask for it, and made to trace the very rays every engine is handed in the checks held to a limit.",
  },
  {
    id: "optiland",
    oldId: "optiland",
    name: "optiland",
    description:
      "optiland, an open-source optical design library in Python, run by this tool in a worker process of its own.",
  },
  {
    id: "reference-tracer",
    oldId: "ref",
    name: "Reference tracer",
    description:
      "The reference tracer: a small exact ray tracer written in this repository from the optics alone, never from LensVisualizer's or optiland's code.",
  },
  {
    id: "reference-seidel",
    oldId: "ref-seidel",
    name: "Reference Seidel sums",
    description:
      "This tool's third-order Seidel sums of the reference tracer's model of the lens, written from the optics alone.",
  },
  {
    id: "replay-of-lv-mtf",
    oldId: "replay",
    name: "Replay of LensVisualizer's MTF",
    description:
      "LensVisualizer's own MTF sampling, repeated step by step, with the geometric MTF summed by this tool.",
  },
  {
    id: "wave-mtf-of-lv-rays",
    oldId: "wave",
    name: "Wave MTF of LensVisualizer's rays",
    description: "This tool's wave-optics MTF estimate, computed from the rays LensVisualizer launches and traces.",
  },
  {
    id: "flux-of-lv-rays",
    oldId: "flux",
    name: "Flux of LensVisualizer's rays",
    description:
      "This tool's estimate of transmission and relative illumination, from the ray lattices LensVisualizer launches and traces.",
  },
  {
    id: "otf-of-optiland-wavefront",
    oldId: "optiland-wave",
    name: "OTF of optiland's wavefront",
    description: "This tool's OTF and Zernike fit of the raw wavefront samples that optiland computes.",
  },
];

/** The built-in engine of an id, today's or the one it had before the rename, or undefined. */
export function engineOf(id: string): EngineText | undefined {
  return ENGINES.find((engine) => engine.id === id) ?? ENGINES.find((engine) => engine.oldId === id);
}

/** The name of an engine; an id that is no built-in engine's (a configured engine) is returned unchanged. */
export function engineName(id: string): string {
  return engineOf(id)?.name ?? id;
}
