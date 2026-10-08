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

export { BENCHMARK_KEYS } from "../../suites/support.ts";
