// What the tests against the real LensVisualizer share. They run with `npm run test:lv`, never with
// `npm run check`, and each skips with a stated reason when LensVisualizer is not configured or not on disk.
// Nothing here writes anything: not into this repository and not into the LV checkout.
import { existsSync } from "node:fs";
import { join } from "node:path";

import { REPO_ROOT, loadConfig } from "../../../src/core/config.ts";
import { LV_MARKER } from "../../../src/engines/lv/binding.ts";

/** The LensVisualizer checkout of this repository's configuration and the environment, or null. */
export const LV_PATH: string | null = loadConfig({ rootDir: REPO_ROOT, env: process.env }).config.lvPath;

/** False when the real LensVisualizer can be used; else the reason a test is skipped. */
export const LV_UNAVAILABLE: string | false = (() => {
  if (LV_PATH === null) return "LensVisualizer is not configured (lvPath, or LVRTC_LV_PATH)";
  if (!existsSync(join(LV_PATH, LV_MARKER))) return `no LensVisualizer checkout at ${LV_PATH}`;
  return false;
})();

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
