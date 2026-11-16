// The codes a user meets most, in plain words, each with what to do about it. A code stays what the engines, the
// exporter and the comparisons state; a screen shows the sentence and the remedy after it. A remedy names the key of
// lvrtc.local.json or the environment variable that sets the same value.

/** One code: what it means, and what to do (empty when there is nothing to do). */
export interface CodeText {
  readonly sentence: string;
  readonly remedy: string;
}

const LV_PATH =
  "Set lvPath in lvrtc.local.json (or the environment variable LVRTC_LV_PATH) to a LensVisualizer checkout.";
const OPTILAND_PYTHON =
  "Set engines.optiland.python in lvrtc.local.json (or LVRTC_OPTILAND_PYTHON) to a Python interpreter that can import optiland.";
const PYTHON =
  "Set python in lvrtc.local.json (or the environment variable LVRTC_PYTHON) to a Python 3.10 or later interpreter.";
const RUN_AGAIN = "Run the suite again: the lens state is exported anew.";

/** What to set, and where, for each value a user sets on their own machine. */
export const REMEDIES = {
  lvPath: LV_PATH,
  optilandPython: OPTILAND_PYTHON,
  python: PYTHON,
} as const;

/** The ways LensVisualizer cannot be loaded (`LvBindingErrorCode`), also met with the prefix `lv-`. */
const LV_BINDING: Readonly<Record<string, CodeText>> = {
  "path-missing": {
    sentence: "The LensVisualizer path that is set is not a directory.",
    remedy: LV_PATH,
  },
  "not-lv-checkout": {
    sentence: "The LensVisualizer path that is set holds no LensVisualizer checkout (no src/optics/buildLens.ts).",
    remedy: LV_PATH,
  },
  "loader-conflict": {
    sentence: "This process already loads another LensVisualizer checkout; one process serves one checkout.",
    remedy: "Run one command per LensVisualizer checkout.",
  },
  "import-failed": {
    sentence:
      "A module of LensVisualizer could not be imported; a checkout older than LensVisualizer's engine rewrite (460f841f) cannot be loaded at all.",
    remedy:
      "Update the LensVisualizer checkout, and check that lvPath in lvrtc.local.json (or LVRTC_LV_PATH) names it.",
  },
  "exports-missing": {
    sentence: "LensVisualizer lacks a function this tool needs, or it is not of the kind expected.",
    remedy: "Use the LensVisualizer commit the baselines name, or a later one this tool supports.",
  },
  "unknown-lens": {
    sentence: "LensVisualizer's catalog holds no lens of that key.",
    remedy: "Run lvrtc lenses list to see the keys.",
  },
};

/** Every code with words, by the code as it is stated. */
export const CODES: Readonly<Record<string, CodeText>> = {
  // An engine that cannot be used at all (`ENGINE_UNAVAILABLE_CODES`).
  "not-configured": {
    sentence:
      "The engine is not set up on this machine, or no engine has that id: LensVisualizer needs lvPath, optiland needs engines.optiland.python, and any other engine its definition in the configuration.",
    remedy: `${LV_PATH} ${OPTILAND_PYTHON} Or check the engine id.`,
  },
  "unsupported-transport": {
    sentence: "The engine's definition names a transport this tool does not have.",
    remedy: "Use one of the transports the configuration documents: in-process, stdio, oneshot or file-exchange.",
  },
  "load-failed": {
    sentence: "The engine's code could not be loaded: its module is missing or failed to import.",
    remedy: "Check the module path in the engine's definition.",
  },
  "bad-module": {
    sentence: "The engine's module does not export a createEngine function.",
    remedy: "Check the module path in the engine's definition.",
  },
  "create-failed": {
    sentence: "The engine could not be made: it refused its options, or did not return a handler.",
    remedy: "Check the options in the engine's definition.",
  },
  "spawn-failed": {
    sentence: "The engine's process did not start: its program or interpreter is not on this machine.",
    remedy: `${OPTILAND_PYTHON} For the Python worker kit, set python (or LVRTC_PYTHON).`,
  },
  "hello-failed": {
    sentence:
      "The engine started but did not answer its first message in time, or refused it (as optiland's worker does when its interpreter cannot import optiland).",
    remedy: OPTILAND_PYTHON,
  },
  "bad-descriptor": {
    sentence: "The engine's description of itself is not valid.",
    remedy: "",
  },
  "contract-mismatch": {
    sentence: "The engine does not speak the version of the message format this tool speaks.",
    remedy: "",
  },
  "id-mismatch": {
    sentence: "The engine names itself differently from the id it is configured under.",
    remedy: "",
  },
  ...LV_BINDING,
  ...Object.fromEntries(Object.entries(LV_BINDING).map(([code, text]) => [`lv-${code}`, text])),
  "lv-load-failed": {
    sentence: "LensVisualizer could not be loaded: lvPath holds nothing this tool can load.",
    remedy: LV_PATH,
  },
  "lv-not-configured": {
    sentence: "No LensVisualizer checkout is set, so no lens can be exported.",
    remedy: LV_PATH,
  },
  // A lens state that cannot be exported, or a figure that cannot be asked.
  "finite-conjugate-unavailable": {
    sentence: "LensVisualizer gives no object distance for this focus position, so it cannot be exported.",
    remedy: "",
  },
  "aperture-faster-than-wide-open": {
    sentence: "The f-number asked is faster than the lens opens at this zoom position; it is not clamped.",
    remedy: "Ask an f-number on the lens's aperture slider.",
  },
  "aperture-beyond-slider-range": {
    sentence: "The f-number asked is slower than the lens's aperture slider goes; it is not clamped.",
    remedy: "Ask an f-number on the lens's aperture slider.",
  },
  "f8-comparison-unavailable": {
    sentence: "LensVisualizer's MTF tab offers no f/8 comparison for this lens.",
    remedy: "",
  },
  "lv-best-axial-unavailable": {
    sentence: "LensVisualizer's focus search finds no best axial focus for this lens state.",
    remedy: "",
  },
  "lv-best-axial-needs-lv-spectrum": {
    sentence: "LensVisualizer's best focus is asked on wavelengths that are none of LensVisualizer's spectra.",
    remedy: "",
  },
  "wavelength-outside-fitted-range": {
    sentence: "A wavelength asked lies outside the range LensVisualizer's glass indices are fitted over (g to C).",
    remedy: "",
  },
  "mixed-reference": {
    sentence:
      "The lens mixes glasses of different index references (d, D or e) without wavelength data for every glass.",
    remedy: "",
  },
  "spectral-data-unavailable": {
    sentence: "A glass of the lens lacks the dispersion data that several wavelengths need.",
    remedy: "",
  },
  "unsupported-path": {
    sentence: "LensVisualizer's MTF does not cover this lens, so it gives no indices for several wavelengths.",
    remedy: "",
  },
  "folded-auto-path": {
    sentence: "The folded lens finds its mirrors by an automatic search, not by a fixed declared path.",
    remedy: "",
  },
  "folded-interaction-budget": {
    sentence: "LensVisualizer's interaction budget does not allow the folded lens's complete path to the image.",
    remedy: "",
  },
  "tilted-surface": {
    sentence: "A surface of the lens is tilted.",
    remedy: "",
  },
  "non-refract-interaction": {
    sentence: "A surface acts on light in a way that has no exact declared path.",
    remedy: "",
  },
  "diffractive-surface": {
    sentence: "The lens has a diffractive surface (a code of older census files).",
    remedy: "",
  },
  "tilted-image-plane": {
    sentence: "The image plane is not perpendicular to the axis.",
    remedy: "",
  },
  "off-axis-image-plane": {
    sentence: "The image plane is not centred on the axis.",
    remedy: "",
  },
  "curved-image-surface": {
    sentence: "The lens forms its image on a curved surface, where a case has a flat image plane.",
    remedy: "",
  },
  "surface-profile-unsupported": {
    sentence: "LensVisualizer gives a surface a profile that its radius and asphere terms do not explain.",
    remedy: "",
  },
  "asphere-coefficient-unknown": {
    sentence: "An asphere has a coefficient other than its conic and its polynomial terms.",
    remedy: "",
  },
  "synthetic-surface-unknown": {
    sentence: "LensVisualizer generated a surface of a kind other than a rear plate.",
    remedy: "",
  },
  "unverified-scale": {
    sentence:
      "LensVisualizer's MTF has not checked the scale of this lens, so it gives no indices for several wavelengths.",
    remedy: "",
  },
  "folded-post-path-reflection": {
    sentence: "A traced ray of this folded lens reflects again after its declared path, so the run is refused.",
    remedy: "",
  },
  "diffractive-phase-unsupported": {
    sentence: "A diffractive surface's phase cannot be stated exactly as LensVisualizer prepares it.",
    remedy: "",
  },
  "lens-build-failed": {
    sentence: "LensVisualizer could not build the lens.",
    remedy: "",
  },
  "state-prepare-failed": {
    sentence: "LensVisualizer could not prepare the lens at this zoom, focus and stop.",
    remedy: "",
  },
  "lv-field-unaimed": {
    sentence: "LensVisualizer aimed no ray of this field's lattice, so the field has no rays to compare.",
    remedy: "",
  },
  // What an answer or a job can be.
  "stale-case": {
    sentence:
      "The lens state was exported from LensVisualizer, and LensVisualizer no longer gives the same one (its lens file or its code changed).",
    remedy: RUN_AGAIN,
  },
  "case-source": {
    sentence: "LensVisualizer answers only about lens states it exported itself, not those read from a file.",
    remedy: "",
  },
  "bad-spec": {
    sentence:
      "The request is not one this engine can read (for LensVisualizer: not what its tab would ask for this lens state).",
    remedy: "",
  },
  "engine-failure": {
    sentence: "The engine raised an error while it computed its answer.",
    remedy: "",
  },
  "time-budget": {
    sentence: "optiland's worker gave up on the request after its time budget of 300 s; the answer is not kept.",
    remedy: "Ask fewer fields in one request.",
  },
  pending: {
    sentence: "The job waits for an operator's answer to a file-exchange engine.",
    remedy: "Run lvrtc collect once the operator has left the answer.",
  },
  "lines.polychromatic": {
    sentence: "optiland's FFT MTF is of one wavelength, so a lens state of several wavelengths has no FFT answer.",
    remedy: "",
  }, // A run directory or a configuration that names a check or an engine by the id it had before it was renamed.
  "written-before-id-rename": {
    sentence: "The run was written before some check or engine ids were renamed, so its records name the old ids.",
    remedy: "Run the suite again: the new run is written with the new ids.",
  },
  "engine-defined-under-old-id": {
    sentence: "The configuration defines an engine under an id that has been renamed.",
    remedy: "Rename the engine's entry under engines in lvrtc.config.json or lvrtc.local.json to its new id.",
  }, // A list of known failures (docs/known-failures.<suite>.json) names a run the suite does not have.
  "known-failure-of-no-run": {
    sentence: "A list of known failures names a run that the suite does not have, so that entry can never be met.",
    remedy:
      "Correct the entry's run name (a focus station's run is named after LensVisualizer's row, which a lens edit can renumber), or remove the entry.",
  },
};

/** The words of a code, or undefined when it has none. */
export function codeTextOf(code: string): CodeText | undefined {
  return Object.hasOwn(CODES, code) ? CODES[code] : undefined;
}

/**
 * The words of a code of one engine: of LensVisualizer (`lv`), its `lv-` variant first, which names lvPath; else the
 * code's own words.
 */
export function engineCodeTextOf(engine: string | undefined, code: string): CodeText | undefined {
  return (engine === "lv" ? codeTextOf(`lv-${code}`) : undefined) ?? codeTextOf(code);
}

/** A code, its sentence and its remedy, as one line; a code with no words is returned unchanged. */
export function codeText(code: string): string {
  const text = codeTextOf(code);
  if (text === undefined) return code;
  return text.remedy === "" ? `${code}: ${text.sentence}` : `${code}: ${text.sentence} ${text.remedy}`;
}
