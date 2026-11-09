// The glossary: the words a reviewer meets, each with the tool's own words it replaces on screen.

/** One term of the glossary. */
export interface TermText {
  readonly term: string;
  /** The words of this tool's code and history that the term replaces on screen; empty when it replaces none. */
  readonly replaces: readonly string[];
  readonly definition: string;
}

/** Every term, in the order the glossary lists them. */
export const TERMS: readonly TermText[] = [
  {
    term: "check",
    replaces: ["rung", "ladder"],
    definition:
      "One comparison this tool makes of two engines' answers to the same request, such as the ray trace or the wave MTF. Each check is held to a limit or sets two answers side by side.",
  },
  {
    term: "held to a limit",
    replaces: ["gated"],
    definition:
      "A check whose figures must be at or below the limits of the limits file; it passes or fails. Every such check hands both engines the same input, often the very same rays.",
  },
  {
    term: "limit",
    replaces: ["tolerance", "gate"],
    definition: "The largest value a judged figure may take for a pair to pass.",
  },
  {
    term: "side by side",
    replaces: ["recorded"],
    definition:
      "A check that sets two methods' answers beside each other with no limit: each engine uses its own method and sampling, so a difference is written down and fails nothing.",
  },
  {
    term: "review band",
    replaces: ["attention band"],
    definition:
      "A width for attention on a side-by-side figure: a difference outside it is worth a look and is not a failure.",
  },
  {
    term: "lens state",
    replaces: ["case"],
    definition:
      "One lens as every engine is handed it: the lens at one zoom, focus and stop, with its wavelengths, field angles and image plane.",
  },
  {
    term: "wavelength",
    replaces: ["line"],
    definition:
      "One of the wavelengths a lens state is evaluated at, with its weight and the refractive index of every glass at it.",
  },
  {
    term: "reference wavelength",
    replaces: ["reference line"],
    definition:
      "The wavelength a lens's glasses are specified at: the d line (587.56 nm), or the e line for some lenses.",
  },
  {
    term: "photopic",
    replaces: [],
    definition: "A set of several wavelengths weighted by the eye's daylight sensitivity, for white-light figures.",
  },
  {
    term: "engine",
    replaces: [],
    definition:
      "A program that answers requests about a lens state: LensVisualizer under review, optiland as an independent external engine, or one of this tool's own.",
  },
  {
    term: "verdict",
    replaces: [],
    definition: "What a check found of a pair: within or beyond its limit, side by side, not computed or an error.",
  },
  {
    term: "lens configuration",
    replaces: ["configuration"],
    definition:
      "A lens, or a zoom at one end, as a suite names it; each is run in several lens states (wavelengths, stops, image planes).",
  },
  {
    term: "suite",
    replaces: [],
    definition: "A file under suites/ that names lenses, the states to run them in, the engines and the checks.",
  },
  {
    term: "run",
    replaces: [],
    definition:
      "One lens state of a suite, run on its engines. A zoom with no zoom position stated is run at both ends, as two runs.",
  },
  {
    term: "request",
    replaces: [],
    definition:
      "One question asked of every engine of a run, such as the trace of a set of rays or the MTF of a field.",
  },
  {
    term: "pair",
    replaces: [],
    definition: "Two engines' answers to one request, which a check compares and gives one verdict.",
  },
  {
    term: "identical rays",
    replaces: [],
    definition:
      "The very same rays, start point and direction to the last bit, handed to every engine to trace, so that what is compared is the tracing and not the choice of rays.",
  },
  {
    term: "ray lattice",
    replaces: [],
    definition:
      "The square grid of rays LensVisualizer launches across the stop of a field, each aimed at its own point of the stop.",
  },
  {
    term: "reference tracer",
    replaces: ["ref"],
    definition:
      "A small exact ray tracer in this repository, written from the optics alone and tested against closed forms, never against another tracer's output.",
  },
  {
    term: "baseline",
    replaces: [],
    definition:
      "The committed record of a suite's verdicts and figures, a file under baselines/. A baseline check runs the suite again and says what changed.",
  },
  {
    term: "record",
    replaces: [],
    definition: "One entry of a baseline: the verdict and figures of one pair of engines in one check of one run.",
  },
  {
    term: "run record",
    replaces: ["manifest"],
    definition: "The file a run writes of what it asked, which engines answered and where each answer is kept.",
  },
  {
    term: "result cache",
    replaces: ["store", "result store"],
    definition:
      "Where each engine's answers are kept, keyed by the request and the engine version, so that an unchanged question is not asked again.",
  },
  {
    term: "limits file",
    replaces: ["policy"],
    definition: "The file under policy/ that holds every check's limits and review bands, with a version number.",
  },
  {
    term: "engine version",
    replaces: ["fingerprint", "adapter revision"],
    definition:
      "Two hashes that identify an answer's source: one of the engine's own code and one of this tool's code behind it. An answer is kept only for the version that gave it.",
  },
  {
    term: "MTF setup",
    replaces: ["recipe"],
    definition:
      "What LensVisualizer's MTF tab sets for a lens state: the field angles, the frequencies, the image plane and the sampling.",
  },
  {
    term: "maintainer",
    replaces: ["owner"],
    definition:
      "The person who keeps this repository: writes the baselines, raises the limits file's version and runs cache maintenance.",
  },
  {
    term: "field",
    replaces: [],
    definition: "A direction of incoming light, given as an angle from the axis or as a fraction of the half field.",
  },
  {
    term: "tangential and sagittal cuts",
    replaces: [],
    definition:
      "The two directions an MTF or a focus is given in: the tangential in the plane of the field and the axis, the sagittal across it.",
  },
  {
    term: "stop",
    replaces: [],
    definition: "The aperture that limits the beam on the axis; its radius sets the f-number.",
  },
  {
    term: "pupil",
    replaces: [],
    definition: "The image of the stop seen from the object side (entrance pupil) or from the image side (exit pupil).",
  },
  {
    term: "design plane",
    replaces: [],
    definition: "The image plane where the lens prescription puts it.",
  },
  {
    term: "best focus",
    replaces: ["lv-best-axial"],
    definition:
      "The image plane LensVisualizer's own focus search finds for a stop and a set of wavelengths, handed to every engine as a plane.",
  },
];
