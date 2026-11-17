// The committed suites (`suites/*.json`), one line each.

/** One suite, or a group of suite files. */
export interface SuiteText {
  /** The file name without `.json`, or a directory under suites/ for a group. */
  readonly name: string;
  readonly description: string;
}

/** Every committed suite file, and the reproducers as a group. */
export const SUITES: readonly SuiteText[] = [
  {
    name: "benchmark",
    description:
      "Twelve lens configurations (ten primes, and a zoom at both ends) on the reference wavelength and on photopic wavelengths, wide open and at f/8, at the design plane and at LensVisualizer's best focus: 96 runs.",
  },
  {
    name: "features",
    description:
      "One lens for each kind of lens data the benchmark lacks: an odd-order asphere, an e-line lens, a high-order asphere term, an asphere on a flat base, a rear plate rim, a fixed-iris zoom, an asphere without terms and a stop inside an element.",
  },
  {
    name: "states",
    description:
      "Every benchmark lens at f/5.6 and f/11 on both sets of wavelengths and both image planes, and the zoom at its published zoom positions.",
  },
  {
    name: "focus-stations",
    description:
      "The documented close-focus stations of the 35 catalog lenses that declare them, each at the object distance LensVisualizer states for it, wide open on the reference wavelength at the design plane.",
  },
  {
    name: "folded",
    description:
      "Sixteen mirror lenses whose light path folds back, on the built-system, first-order, ray-trace and optical-path checks.",
  },
  {
    name: "diffractive",
    description:
      "Eight lenses with diffractive surfaces, nine lens states, on the built-system, first-order, ray-trace and optical-path checks.",
  },
  {
    name: "smoke",
    description: "Two simple primes and a simple zoom: a quick first run of LensVisualizer and the reference tracer.",
  },
  {
    name: "catalog",
    description:
      "Every lens of LensVisualizer's catalog, wide open, at both zoom ends: the maintainer's full sweep. Its baselines are a dated snapshot.",
  },
  {
    name: "catalog-repro",
    description:
      "The files under suites/catalog-repro: each a one-run suite that repeats one catalog lens state a known failure was found on.",
  },
  {
    name: "focus-stations-repro",
    description:
      "The files under suites/focus-stations-repro: each a one-run suite that repeats one focus station a known failure was found on.",
  },
];

/** The line of a suite, or undefined. */
export function suiteOf(name: string): SuiteText | undefined {
  return SUITES.find((suite) => suite.name === name);
}
