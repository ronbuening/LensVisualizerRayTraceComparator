// The built-in engines, in plain words. An engine id stays the stored id until the rename; `newId` is the id it will
// take (LensVisualizer and optiland keep theirs).

/** One built-in engine. */
export interface EngineText {
  readonly id: string;
  readonly newId: string;
  readonly name: string;
  readonly description: string;
}

/** Every built-in engine (`src/engines/builtin.ts`). */
export const ENGINES: readonly EngineText[] = [
  {
    id: "lv",
    newId: "lv",
    name: "LensVisualizer",
    description:
      "LensVisualizer itself, loaded from a local checkout, asked for each figure as its own tabs ask for it, and made to trace the very rays every engine is handed in the checks held to a limit.",
  },
  {
    id: "optiland",
    newId: "optiland",
    name: "optiland",
    description:
      "optiland, an open-source optical design library in Python, run by this tool in a worker process of its own.",
  },
  {
    id: "ref",
    newId: "reference-tracer",
    name: "Reference tracer",
    description:
      "The reference tracer: a small exact ray tracer written in this repository from the optics alone, never from LensVisualizer's or optiland's code.",
  },
  {
    id: "ref-seidel",
    newId: "reference-seidel",
    name: "Reference Seidel sums",
    description:
      "This tool's third-order Seidel sums of the reference tracer's model of the lens, written from the optics alone.",
  },
  {
    id: "replay",
    newId: "replay-of-lv-mtf",
    name: "Replay of LensVisualizer's MTF",
    description:
      "LensVisualizer's own MTF sampling, repeated step by step, with the geometric MTF summed by this tool.",
  },
  {
    id: "wave",
    newId: "wave-mtf-of-lv-rays",
    name: "Wave MTF of LensVisualizer's rays",
    description: "This tool's wave-optics MTF estimate, computed from the rays LensVisualizer launches and traces.",
  },
  {
    id: "flux",
    newId: "flux-of-lv-rays",
    name: "Flux of LensVisualizer's rays",
    description:
      "This tool's estimate of transmission and relative illumination, from the ray lattices LensVisualizer launches and traces.",
  },
  {
    id: "optiland-wave",
    newId: "otf-of-optiland-wavefront",
    name: "OTF of optiland's wavefront",
    description: "This tool's OTF and Zernike fit of the raw wavefront samples that optiland computes.",
  },
];

/** The built-in engine of an id, or undefined. */
export function engineOf(id: string): EngineText | undefined {
  return ENGINES.find((engine) => engine.id === id);
}

/** The name of an engine; an id that is no built-in engine's (a configured engine) is returned unchanged. */
export function engineName(id: string): string {
  return engineOf(id)?.name ?? id;
}
