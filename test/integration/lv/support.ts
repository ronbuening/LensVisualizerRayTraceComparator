// What the tests against the real LensVisualizer share. They run with `npm run test:lv`, never with
// `npm run check`, and each skips with a stated reason when LensVisualizer is not configured or not on disk.
// Nothing here writes anything: not into this repository and not into the LV checkout.
import { existsSync } from "node:fs";
import { join } from "node:path";

import { REPO_ROOT, loadConfig } from "../../../src/core/config.ts";
import { LV_MARKER } from "../../../src/engines/lv/binding.ts";
import type { LvBinding } from "../../../src/engines/lv/binding.ts";
import type { LvExporter } from "../../../src/engines/lv/caseSource.ts";

/** The LensVisualizer checkout of this repository's configuration and the environment, or null. */
export const LV_PATH: string | null = loadConfig({ rootDir: REPO_ROOT, env: process.env }).config.lvPath;

/** False when the real LensVisualizer can be used; else the reason a test is skipped. */
export const LV_UNAVAILABLE: string | false = (() => {
  if (LV_PATH === null) return "LensVisualizer is not configured (lvPath, or LVRTC_LV_PATH)";
  if (!existsSync(join(LV_PATH, LV_MARKER))) return `no LensVisualizer checkout at ${LV_PATH}`;
  return false;
})();

export { BENCHMARK_CONDITIONS, BENCHMARK_KEYS, asItOpens } from "../../suites/support.ts";

/** One focus station a lens documents (`finiteConjugates` of its file), exported, and what LensVisualizer says of it. */
export interface FocusStation {
  readonly key: string;
  readonly focusT: number;
  readonly zoomT: number;
  /** The station in words: `<key> at focus <focusT>, zoom <zoomT>`. */
  readonly at: string;
  /** What the exporter made of the lens in that state. */
  readonly exported: Awaited<ReturnType<LvExporter["exportLens"]>>;
  /**
   * Null for a station LensVisualizer certifies: its gate hands the conjugate of exactly that state. Else the gate's
   * own reason for handing none, which it gives for a lens outside its MTF path before it looks at the conjugate.
   */
  readonly refused: string | null;
}

/**
 * Every focus station the lenses of the catalog document, in catalog order, each exported at its focus and zoom
 * position and held against LensVisualizer's gate (`assessMtfSupport` with the stop wide open): a station is
 * certified when the gate hands its conjugate for exactly that state (CONTRACT.md, `conditions.object`).
 */
export async function focusStations(binding: LvBinding, exporter: LvExporter): Promise<FocusStation[]> {
  const stations: FocusStation[] = [];
  for (const { key } of (await binding.catalog()).entries) {
    const { data } = await binding.lens(key);
    const documented = data.finiteConjugates as { focusT: number; zoomT: number }[] | undefined;
    for (const { focusT, zoomT } of documented ?? []) {
      const exported = await exporter.exportLens(key, { state: { zoomT, focus: { kind: "focusT", value: focusT } } });
      const runtime = binding.api.buildLens(data);
      const radius = binding.api.wideOpenStopAtZoom(zoomT, runtime);
      const gate = binding.api.assessMtfSupport(binding.api.prepareRuntimeState(runtime, focusT, zoomT), {
        method: "geometric",
        spectrum: "reference",
        pupilSemiDiameterMm: radius,
        stopSemiDiameterMm: radius,
        focus: "design",
      });
      const refused = gate.conjugate === undefined ? String(gate.reason) : null;
      stations.push({ key, focusT, zoomT, at: `${key} at focus ${focusT}, zoom ${zoomT}`, exported, refused });
    }
  }
  return stations;
}
