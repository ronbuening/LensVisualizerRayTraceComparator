// The checks, in plain words: what each compares, what it shows and what it does not. A check is what the code calls
// a rung (`src/core/rungs.ts`); its id stays the stored id until the rename, and `newId` is the id it will take.
// Every string here is linted (`test/vocabulary/vocabulary.test.ts`), and `src/report/wording.ts` takes the words
// of the validation statement and matrix from this file, so a report's bytes do not move.

/** Whether a check holds two engines to a limit, or sets two methods side by side with no limit. */
export type CheckKind = "limit" | "side-by-side";

/** One check, in words for someone who knows optics and not this tool. */
export interface CheckText {
  /** The id stored in suites, baselines and comparisons today. */
  readonly id: string;
  /** The id the check takes when the ids are renamed. */
  readonly newId: string;
  readonly title: string;
  readonly kind: CheckKind;
  /** What it compares, one sentence without a full stop (the statement and the matrix print it as it is). */
  readonly compares: string;
  /** What a pass, or a comparison written down, does show. */
  readonly shows: string;
  /** What it does not establish. */
  readonly doesNotShow: string;
  /** The first row of the validation matrix that names it (a LensVisualizer tab), or null. */
  readonly tab: string | null;
  /** Whether the validation statement names it. */
  readonly inStatement: boolean;
  /** Whether the validation matrix names it. */
  readonly inMatrix: boolean;
}

/** Every check, in the order of `RUNGS`. */
export const CHECKS: readonly CheckText[] = [
  {
    id: "selftest",
    newId: "pipeline-echo",
    title: "Pipeline echo (a test of this tool)",
    kind: "limit",
    compares: "An array this tool hands a test engine and the array the engine hands back",
    shows: "That this tool's requests, transports and comparisons carry numbers through unchanged.",
    doesNotShow: "Anything about a lens or about LensVisualizer: no optics is computed.",
    tab: null,
    inStatement: false,
    inMatrix: false,
  },
  {
    id: "r0",
    newId: "built-system",
    title: "Built system",
    kind: "limit",
    compares: "Built layout, shape, aperture, index and sampled sag",
    shows:
      "That each engine built the same system from the lens state it was handed: the same surfaces at the same places, the same shapes, apertures and refractive indices, and the same sag at sampled heights, within the limit.",
    doesNotShow:
      "Whether the lens state LensVisualizer exports is a faithful model of the real lens: its prescription, glass data and stop size are LensVisualizer's own, handed to every engine.",
    tab: "foundation",
    inStatement: true,
    inMatrix: true,
  },
  {
    id: "r1",
    newId: "first-order",
    title: "First-order data",
    kind: "limit",
    compares: "First-order quantities and pupils",
    shows:
      "That the engines' paraxial models give the same focal length, focal and principal points, back focus and pupil positions and sizes, within the limit.",
    doesNotShow:
      "Anything about real rays outside the paraxial region, or whether LensVisualizer's lens data are the maker's design.",
    tab: "foundation",
    inStatement: true,
    inMatrix: true,
  },
  {
    id: "r2",
    newId: "ray-trace",
    title: "Ray trace",
    kind: "limit",
    compares: "Hits, directions, image landings and masks of identical rays",
    shows:
      "That, handed the same rays, the engines find the same hit points on every surface, the same exit directions and image landings, and stop the same rays, within the limit.",
    doesNotShow:
      "That the rays LensVisualizer launches are the ones that best model the lens, how LensVisualizer chooses or aims them, or anything about glass dispersion data.",
    tab: "foundation",
    inStatement: true,
    inMatrix: true,
  },
  {
    id: "r3",
    newId: "optical-path",
    title: "Optical path",
    kind: "limit",
    compares: "Optical path, path to image and chief-relative OPD of identical rays",
    shows:
      "That, handed the same rays, the engines compute the same optical path lengths, to each surface and to the image, and the same optical path difference from the chief ray, within the limit.",
    doesNotShow:
      "How an optical path is turned into a wavefront or an MTF: the MTF checks are about that, each with its own limit or none.",
    tab: "foundation",
    inStatement: true,
    inMatrix: true,
  },
  {
    id: "r4",
    newId: "geometric-mtf",
    title: "Geometric MTF of the same rays",
    kind: "limit",
    compares: "This tool's geometric MTF of identical rays, as each engine traces them",
    shows:
      "That one geometric MTF calculation of this tool, applied to each engine's trace of the same rays, gives curves within the limit of each other.",
    doesNotShow:
      "What LensVisualizer's own MTF tab computes, or how a geometric MTF stands beside a diffraction MTF: other checks set those side by side.",
    tab: "mtf",
    inStatement: true,
    inMatrix: true,
  },
  {
    id: "r4f",
    newId: "lv-mtf-replay",
    title: "LensVisualizer's MTF sampling, replayed",
    kind: "limit",
    compares: "LensVisualizer's geometric MTF beside a replay of its own sampling",
    shows:
      "That LensVisualizer's geometric MTF is, within the limit, the sum this tool forms of LensVisualizer's own sampled rays, with the same sampling grids, ray counts and field outcomes.",
    doesNotShow:
      "Whether LensVisualizer's sampling is fine enough for the lens: the replay repeats LensVisualizer's choices and does not test them.",
    tab: "mtf",
    inStatement: true,
    inMatrix: true,
  },
  {
    id: "r5",
    newId: "mtf-vs-optiland-fft",
    title: "MTF beside optiland's FFT MTF",
    kind: "side-by-side",
    compares:
      "LensVisualizer's diffraction MTF beside optiland's FFT MTF and the wave estimate of LensVisualizer's rays",
    shows:
      "LensVisualizer's diffraction MTF set beside optiland's FFT MTF and this tool's wave estimate on LensVisualizer's rays, field by field, each difference sorted by its cause before it is shown.",
    doesNotShow:
      "Which curve is nearer the lens: each engine uses its own pupil sampling, reference sphere and frequency axis, so a difference is written down and fails nothing. optiland's FFT gives one wavelength at a time, so a white-light run has no FFT row.",
    tab: "mtf",
    inStatement: true,
    inMatrix: true,
  },
  {
    id: "r5g",
    newId: "geometric-mtf-vs-optiland",
    title: "Geometric MTF beside optiland's",
    kind: "side-by-side",
    compares: "Geometric MTF on each method's own pupil sampling",
    shows:
      "LensVisualizer's geometric MTF set beside optiland's own geometric MTF and the replay of LensVisualizer's sampling, each engine with its own rays and pupil sampling.",
    doesNotShow:
      "Which sampling is nearer the lens: both engines sample the stop, each on its own grid and with its own number of rays, so a difference is written down, not explained.",
    tab: "mtf",
    inStatement: true,
    inMatrix: true,
  },
  {
    id: "r6a",
    newId: "wave-mtf",
    title: "Wave MTF of the same rays",
    kind: "limit",
    compares: "This tool's wave MTF of identical rays, as each engine traces them, in fields whose sampling settled",
    shows:
      "That one wave-optics MTF calculation of this tool, applied to each engine's optical paths of the same rays, gives curves within the limit of each other, in fields whose sampling settled.",
    doesNotShow:
      "Fields whose sampling did not settle (a phase step above a quarter wave, or a move when the grid is doubled), which are set aside and not judged; nor what LensVisualizer's own diffraction MTF gives.",
    tab: "mtf",
    inStatement: true,
    inMatrix: true,
  },
  {
    id: "r6b",
    newId: "mtf-vs-wave-estimate",
    title: "MTF beside the wave estimate of LensVisualizer's rays",
    kind: "side-by-side",
    compares: "LensVisualizer's sheared diffraction MTF beside this tool's wave OTF of LensVisualizer's rays",
    shows:
      "LensVisualizer's diffraction MTF set beside this tool's wave estimate on the rays LensVisualizer launches, field by field.",
    doesNotShow:
      "Which estimate is nearer the lens: the two sample the pupil on grids of their own, so a difference is written down and fails nothing.",
    tab: "mtf",
    inStatement: true,
    inMatrix: true,
  },
  {
    id: "r6c",
    newId: "mtf-vs-optiland-wavefront",
    title: "MTF beside the OTF of optiland's wavefront",
    kind: "side-by-side",
    compares:
      "LensVisualizer's MTF, the wave OTF of its rays and optiland's FFT MTF beside this tool's OTF of optiland's raw wavefronts",
    shows:
      "LensVisualizer's diffraction MTF and the wave estimate set beside optiland's FFT MTF and this tool's OTF of optiland's raw wavefront samples, field by field.",
    doesNotShow:
      "Which column is nearer the lens: no column is taken as the reference for another. The reference-sphere model and the FFT axes remain choices of each method.",
    tab: "mtf",
    inStatement: true,
    inMatrix: true,
  },
  {
    id: "r7a",
    newId: "spot-rays",
    title: "Spot and fan rays",
    kind: "limit",
    compares: "Spot and fan figures of the coma and bokeh tabs' rays, on identical rays",
    shows:
      "That, handed the rays LensVisualizer's coma and bokeh tabs launch, the engines give the same transverse errors, spot centroids and RMS radii, and stop the same rays, within the limit.",
    doesNotShow:
      "Whether the tabs sample the pupil finely enough; the bokeh tile at the tab's own plane is not covered.",
    tab: "coma-bokeh",
    inStatement: false,
    inMatrix: true,
  },
  {
    id: "r7b",
    newId: "spot-vs-optiland",
    title: "Spots and fans beside optiland's",
    kind: "side-by-side",
    compares: "LensVisualizer's coma and bokeh tabs beside optiland's SpotDiagram and RayFan",
    shows: "LensVisualizer's spot and ray-fan figures set beside optiland's own spot diagram and ray fan of the field.",
    doesNotShow:
      "Which spot is nearer the lens: the two engines sample the pupil on different rings, so the spot figures have no review band; only the fan figure has one.",
    tab: "coma-bokeh",
    inStatement: false,
    inMatrix: true,
  },
  {
    id: "r8a",
    newId: "axial-rays",
    title: "Spherical aberration and axial colour rays",
    kind: "limit",
    compares: "Axial intercepts of the spherical-aberration and axial-colour sections' rays, on identical rays",
    shows:
      "That, handed the rays LensVisualizer's spherical-aberration and axial-colour sections launch, the engines find the same axial crossings and best focus, judged on the transverse scale, within the limit.",
    doesNotShow: "Anything about glass dispersion data: every engine is handed the same refractive indices.",
    tab: "axial",
    inStatement: false,
    inMatrix: true,
  },
  {
    id: "r8b",
    newId: "axial-vs-optiland",
    title: "Spherical aberration and axial colour beside optiland's",
    kind: "side-by-side",
    compares: "LensVisualizer's spherical-aberration and axial-colour sections beside optiland's own rays and focus",
    shows:
      "LensVisualizer's spherical-aberration and axial-colour figures set beside those of optiland's own rays, aimed at the same points of the stop.",
    doesNotShow: "Which figure is nearer the lens; the colour figures have no review band.",
    tab: "axial",
    inStatement: false,
    inMatrix: true,
  },
  {
    id: "r9a",
    newId: "chief-rays",
    title: "Chief rays (distortion, pupils, lateral colour)",
    kind: "limit",
    compares: "Chief rays of the distortion, pupils and lateral-colour tabs, on identical rays",
    shows:
      "That, handed the chief rays LensVisualizer's distortion, pupils and lateral-colour tabs launch, the engines give the same landings, distortion, lateral colour and exit-pupil crossings, within the limit.",
    doesNotShow: "How LensVisualizer finds the chief ray of each field angle; a fisheye's distortion is not covered.",
    tab: "chief",
    inStatement: false,
    inMatrix: true,
  },
  {
    id: "r9b",
    newId: "chief-vs-optiland",
    title: "Distortion, pupils and lateral colour beside optiland's",
    kind: "side-by-side",
    compares:
      "LensVisualizer's distortion, pupils and lateral-colour tabs beside optiland's distortion, chief rays and pupils",
    shows:
      "LensVisualizer's distortion curve, pupils and lateral colour set beside optiland's own distortion model, chief rays and pupils.",
    doesNotShow: "Which figure is nearer the lens; no figure of this comparison has a review band.",
    tab: "chief",
    inStatement: false,
    inMatrix: true,
  },
  {
    id: "r10a",
    newId: "field-curve-rays",
    title: "Field-curve rays",
    kind: "limit",
    compares: "Tangential and sagittal foci of the field-curve sections' parabasal rays and fans, on identical rays",
    shows:
      "That, handed the rays LensVisualizer's field-curve sections launch, the engines find the same tangential and sagittal foci and chief landings, judged on the transverse scale, within the limit.",
    doesNotShow:
      "Whether LensVisualizer's 0.01 mm parabasal pencil, a convention of its own, is narrow enough to stand for an infinitesimal one.",
    tab: "curvature",
    inStatement: false,
    inMatrix: true,
  },
  {
    id: "r10b",
    newId: "field-curve-vs-optiland",
    title: "Field curves beside optiland's",
    kind: "side-by-side",
    compares: "LensVisualizer's field-curve sections beside optiland's FieldCurvature",
    shows:
      "LensVisualizer's tangential and sagittal focus shifts and astigmatism set beside optiland's own field-curvature analysis.",
    doesNotShow:
      "Which focus is nearer the lens: LensVisualizer's foci are of a 0.01 mm pencil and optiland's of an infinitesimal one.",
    tab: "curvature",
    inStatement: false,
    inMatrix: true,
  },
  {
    id: "r11a",
    newId: "vignetting-rays",
    title: "Vignetting rays",
    kind: "limit",
    compares:
      "Which rays of the vignetting tab's beams get through, their flux and the chief landings, on identical rays",
    shows:
      "That, handed the beams LensVisualizer's vignetting tab launches, the engines let the same rays through and give the same flux into the image and the same chief landings, within the limit.",
    doesNotShow:
      "Whether the tab's lattice is fine enough; states outside the tab's beam model have no vignetting rays and are not covered.",
    tab: "vignetting",
    inStatement: false,
    inMatrix: true,
  },
  {
    id: "r11b",
    newId: "vignetting-vs-flux-estimate",
    title: "Vignetting beside the flux estimate",
    kind: "side-by-side",
    compares: "LensVisualizer's vignetting tab beside this tool's flux estimate on LensVisualizer's lattices",
    shows:
      "LensVisualizer's geometric transmission and relative illumination set beside this tool's flux estimate on LensVisualizer's own lattices.",
    doesNotShow:
      "An external engine's view: optiland has no vignetting analysis, so the other side is this tool's own estimate. The relative illumination and the falloff have no review band.",
    tab: "vignetting",
    inStatement: false,
    inMatrix: true,
  },
  {
    id: "r12b",
    newId: "summary-vs-optiland",
    title: "Summary beside optiland's",
    kind: "side-by-side",
    compares:
      "LensVisualizer's summary tab and aperture control beside optiland's paraxial accessors and working f-number",
    shows:
      "LensVisualizer's focal length, entrance pupil, stop, f-numbers and track set beside optiland's own paraxial values and working f-number.",
    doesNotShow:
      "The stop and the track as the work of two engines: optiland reads them back from the lens state, so they hold the tab to the lens state alone.",
    tab: "summary",
    inStatement: false,
    inMatrix: true,
  },
  {
    id: "r13b",
    newId: "seidel-vs-optiland",
    title: "Seidel sums beside optiland's",
    kind: "side-by-side",
    compares: "This tool's Seidel sums of the reference model beside optiland's",
    shows:
      "The third-order Seidel sums of this tool's reference model set beside optiland's own, surface by surface and in total.",
    doesNotShow:
      "LensVisualizer, which shows no Seidel sums; nor optiland's chromatic sums, which optiland does not state.",
    tab: "no-tab",
    inStatement: false,
    inMatrix: true,
  },
  {
    id: "r14b",
    newId: "zernike-vs-optiland",
    title: "Zernike fit beside optiland's",
    kind: "side-by-side",
    compares: "optiland's Zernike fit beside this tool's fit of the same raw wavefront samples",
    shows:
      "optiland's Zernike fit set beside this tool's fit of the same raw wavefront samples, coefficient by coefficient.",
    doesNotShow:
      "LensVisualizer, which shows no wavefront or Zernike coefficients. Both fits are of optiland's own wavefront, so neither tests optiland's tracing.",
    tab: "no-tab",
    inStatement: false,
    inMatrix: true,
  },
];

/** The check of a stored id, or undefined. */
export function checkOf(id: string): CheckText | undefined {
  return CHECKS.find((check) => check.id === id);
}

/** The title of a check, or the id itself when no check has it. */
export function checkTitle(id: string): string {
  return checkOf(id)?.title ?? id;
}

/** The words of a check as the statement and the matrix print them: its mode in the policy's terms and what it compares. */
export interface CheckModeText {
  readonly mode: "gated" | "recorded";
  readonly compares: string;
}

function modeTexts(include: (check: CheckText) => boolean): Readonly<Record<string, CheckModeText>> {
  return Object.freeze(
    Object.fromEntries(
      CHECKS.filter(include).map((check) => [
        check.id,
        { mode: check.kind === "limit" ? "gated" : "recorded", compares: check.compares } satisfies CheckModeText,
      ]),
    ),
  );
}

/** The checks the validation statement names, in its order. */
export const STATEMENT_CHECKS: Readonly<Record<string, CheckModeText>> = modeTexts((check) => check.inStatement);
/** The checks the validation matrix names, in its order: the statement's, then the rest. */
export const MATRIX_CHECKS: Readonly<Record<string, CheckModeText>> = modeTexts((check) => check.inMatrix);
