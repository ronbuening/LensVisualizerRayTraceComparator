// What the tests of the committed suites share, with or without LensVisualizer.
import { join } from "node:path";

import { REPO_ROOT } from "../../src/core/config.ts";

/** The directory of the committed suites. */
export const SUITES_DIR: string = join(REPO_ROOT, "suites");

/** The committed suites, by name. */
export const SUITE_NAMES = ["benchmark", "features", "smoke"] as const;

/** The path of a committed suite. */
export function suitePath(name: (typeof SUITE_NAMES)[number]): string {
  return join(SUITES_DIR, `${name}.json`);
}

/** The lenses of the benchmark suite; `nikon-z-24-70f4s` is run at both ends of its zoom. */
export const BENCHMARK_KEYS: readonly string[] = [
  "canon-ef-135-f2l-usm",
  "fujifilm-fujinon-gf-63mm-f28-r-wr",
  "sigma-35mm-f14-dg-hsm-a",
  "nikkor-z50f12",
  "sony-fe-20mm-f18-g",
  "sony-fe-400mm-f28-gm-oss",
  "sigma-105mm-f28-dg-dn-macro-art",
  "nikon-z-24-70f4s",
  "nikon-z-mc-105f28",
  "nikon-z-135f18-plena",
  "sigma-45mm-f28-dg-dn-contemporary",
];
