// The rows of the validation matrix, in plain words: a row per LensVisualizer analysis tab, a row of the foundation
// the tabs stand on, and a row of the analyses LensVisualizer has no tab of. `src/report/wording.ts` re-exports them,
// and the matrix report and the dashboard's compare page read them there.

/** One row of the validation matrix: a LensVisualizer tab, or the analyses it has no tab of. */
export interface MatrixRowText {
  readonly tab: string;
  readonly title: string;
  /** What the row's checks are of. */
  readonly about: string;
  /** The ids of the checks held to a limit. */
  readonly gated: readonly string[];
  /** The ids of the side-by-side checks. */
  readonly recorded: readonly string[];
  /** What the row does not cover, whatever its counts: fixed sentences, each ending its sentence. */
  readonly notCovered: readonly string[];
}

/** The rows of the validation matrix, in their order. */
export const MATRIX_ROWS: readonly MatrixRowText[] = [
  {
    tab: "foundation",
    title: "Built system, first-order data, rays and optical path",
    about:
      "The foundation of every tab: the system each engine builds from the lens state, its first-order data, and the hits, landings and optical paths of the rays LensVisualizer launches for its MTF.",
    gated: ["built-system", "first-order", "ray-trace", "optical-path"],
    recorded: [],
    notCovered: [
      "Folded paths and diffractive surfaces: the suites folded and diffractive have ray baselines of their own, outside the benchmark.",
      "The catalog beyond the benchmark: its baselines are a dated snapshot with a report of their own.",
    ],
  },
  {
    tab: "mtf",
    title: "MTF",
    about:
      "LensVisualizer's MTF tab: this tool's geometric and wave MTF of LensVisualizer's launch rays as each engine traces them, LensVisualizer's own geometric MTF beside the replay of its sampling, and the engines' own MTF side by side.",
    gated: ["geometric-mtf", "lv-mtf-replay", "wave-mtf"],
    recorded: ["mtf-vs-optiland-fft", "geometric-mtf-vs-optiland", "mtf-vs-wave-estimate", "mtf-vs-optiland-wavefront"],
    notCovered: ["Each item of the fixed list at the end of this matrix, which every MTF report ends with."],
  },
  {
    tab: "coma-bokeh",
    title: "Coma and bokeh",
    about:
      "LensVisualizer's coma and bokeh tabs: the rings and fans of the coma cloud and the bokeh tile's rings, each sample LensVisualizer's own aimed launch ray.",
    gated: ["spot-rays"],
    recorded: ["spot-vs-optiland"],
    notCovered: [
      "The bokeh tile at the tab's own plane (infSensorZ): deferred.",
      "A finite object and a folded path: each is a coded problem of the run, never approximated; a coma fan on the axis is a coded problem of its field.",
      "The spot figures of check spot-vs-optiland have no review band, since the two engines sample the pupil on different rings; only its fan figure has one.",
    ],
  },
  {
    tab: "axial",
    title: "Spherical aberration and axial colour",
    about:
      "LensVisualizer's spherical-aberration section (aberrations tab) and axial-colour section (chromatic tab): the zones of the axial object, at the lens's own refractive indices and at each colour channel's own.",
    gated: ["axial-rays"],
    recorded: ["axial-vs-optiland"],
    notCovered: [
      "The colour figures of check axial-vs-optiland have no review band.",
      "Bit identity of LensVisualizer's channel indices at the C, F and g lines: no committed suite asks for those wavelengths, and it is not pursued.",
      "A finite object and a folded path: coded problems of the run.",
    ],
  },
  {
    tab: "chief",
    title: "Distortion, lateral colour, pupils and breathing",
    about:
      "LensVisualizer's distortion and pupils tabs and its lateral-colour section: their chief rays, each colour channel's own. Breathing is the focal length of each prepared lens state, which check first-order compares; a test against LensVisualizer alone (breathing.test.ts) holds the breathing chart to that focal length.",
    gated: ["chief-rays", "first-order"],
    recorded: ["chief-vs-optiland"],
    notCovered: [
      "Breathing between the focus stations LensVisualizer declares: a chart position between two stations is no lens state.",
      "A fisheye's distortion (lv-fisheye-projection): a coded problem of the set of rays.",
      "optiland's pupil aberration: another quantity, never asked for.",
      "The figures of check chief-vs-optiland have no review band.",
    ],
  },
  {
    tab: "curvature",
    title: "Field curves and astigmatism",
    about:
      "LensVisualizer's field-curve and astigmatism sections (aberrations tab): the parabasal pencil and the real-ray fans of each field.",
    gated: ["field-curve-rays"],
    recorded: ["field-curve-vs-optiland"],
    notCovered: [
      "LensVisualizer's parabasal pencil is 0.01 mm wide, a convention of its own: its foci are of a finite pencil, beside optiland's infinitesimal pair.",
      "Fields other than the sections' own field fractions.",
    ],
  },
  {
    tab: "vignetting",
    title: "Vignetting and relative illumination",
    about:
      "LensVisualizer's vignetting tab: an aimed lattice of rays on the real stop at each of its fields, the share of it that reaches the image and its flux there.",
    gated: ["vignetting-rays"],
    recorded: ["vignetting-vs-flux-estimate"],
    notCovered: [
      "optiland has no vignetting analysis: the counterpart in check vignetting-vs-flux-estimate is this tool's own flux estimate on LensVisualizer's lattices, not an external engine.",
      "The relative illumination and the falloff of check vignetting-vs-flux-estimate have no review band.",
      "Lens states outside the tab's beam model, and fields launched from a bounding sphere: coded problems, with no vignetting rays.",
    ],
  },
  {
    tab: "summary",
    title: "Summary and cardinal elements",
    about:
      "LensVisualizer's summary tab and aperture control: their readouts are of the prepared lens state and LensVisualizer's paraxial model, which check first-order compares; a test against LensVisualizer alone (summary.test.ts) holds the readouts to the first-order values of check first-order; the tab traces no ray of its own.",
    gated: ["first-order"],
    recorded: ["summary-vs-optiland"],
    notCovered: [
      "The half field, the focus distance, the controls and the Current Perspective Pose section of the tab.",
      "The aperture control's paraxial working f-number beside the mark, shown only above a difference of 0.05.",
      "The stop and the track in check summary-vs-optiland are optiland's reading of the lens state: they hold the tab to the lens state, not two engines to each other.",
    ],
  },
  {
    tab: "no-tab",
    title: "Seidel sums, wavefront and Zernike fits (no LensVisualizer tab)",
    about:
      "LensVisualizer presents no Seidel sums, wavefront or Zernike coefficients: these checks set optiland beside this tool's own estimates, by OpticStudio's conventions, and LensVisualizer is not asked.",
    gated: [],
    recorded: ["seidel-vs-optiland", "zernike-vs-optiland"],
    notCovered: [
      "optiland's chromatic Seidel sums: optiland states none for a lens of one wavelength.",
      "The reference tracer as a third Zernike answer: the raw wavefront quantity (wavefront.native, version 1) carries no launch rays.",
      "OpticStudio's figures to the centroid.",
      "LensVisualizer, which has no tab of these analyses.",
    ],
  },
];
