// Opt-in source-published states. These selectors are consumed by CaseSource.expand, never by expandSuite.
import type { RunSpec } from "../../contract/runSpec.ts";
import type { LvBinding } from "./binding.ts";
import type { LensBuilder } from "./lensBuilder.ts";
import { ZOOM_ENDS } from "./zoomEnds.ts";

/** Conflicting coordinates are a problem of the written run, never silently overwritten. */
export function stationSelectionProblem(run: RunSpec): string | null {
  if (run.lens.kind !== "lv" || run.lens.stations === undefined) return null;
  if (run.state?.zoomT !== undefined || run.state?.focus !== undefined) {
    return "station-selection-conflict: a station selector cannot also state zoom or focus coordinates";
  }
  if (run.lens.key === "*" && run.lens.stations !== "certified-focus") {
    return "station-selection-conflict: the catalog selector * is only for certified-focus";
  }
  return null;
}

/** The ordinary runs selected by LV's published zoom seam or its declared certified finite conjugates. */
export async function expandLvStations(
  run: RunSpec,
  binding: LvBinding,
  build: LensBuilder,
): Promise<readonly RunSpec[]> {
  if (run.lens.kind !== "lv" || !run.lens.stations || stationSelectionProblem(run)) return [run];
  const { key, stations } = run.lens;
  const keys = key === "*" ? (await binding.catalog()).entries.map((entry) => entry.key) : [key];
  const expanded: RunSpec[] = [];
  for (const key of keys) {
    // Catalog selection inspects declarations only; it builds no lens without a declared conjugate.
    const data = key === "*" ? (await binding.lens(key)).data : undefined;
    if (data && !data.focus?.conjugates?.length) continue;
    const lens = await build(key);
    if (!lens.ok) {
      expanded.push({ ...run, name: `${run.name}-${key}`, lens: { kind: "lv", key } });
      continue;
    }
    const { runtime } = lens;
    if (stations === "published-zoom") {
      if (!runtime.isZoom) {
        expanded.push({ ...run, lens: { kind: "lv", key } });
        continue;
      }
      // Ends remain mandatory even when LV publishes no middle station. Unpublished interpolator knots stay out.
      const zooms = [...new Set([0, ...binding.api.publishedZoomStations(runtime).map((s) => s.zoomT), 1])].sort(
        (a, b) => a - b,
      );
      for (const zoomT of zooms) {
        const end = ZOOM_ENDS.find((end) => end.zoomT === zoomT)?.end ?? `zoom${zoomT}`;
        expanded.push({ ...run, name: `${run.name}-${end}`, lens: { kind: "lv", key }, state: { zoomT } });
      }
    } else {
      const authored = data ?? (await binding.lens(key)).data;
      const frames = authored.focus?.keyframes ?? [0, 1];
      const count = authored.zoom?.stations?.length ?? 1;
      const seen = new Set<string>();
      for (const { zoomStation, keyframe } of authored.focus?.conjugates ?? []) {
        const focusT = frames[keyframe];
        const zoomT = count > 1 ? zoomStation / (count - 1) : 0;
        const address = `zoom${zoomStation}-focus${keyframe}`;
        if (seen.has(address)) continue;
        seen.add(address);
        // Every declared certified station is a run. Export reports a gate refusal instead of hiding it.
        expanded.push({
          ...run,
          name: `${run.name}-${key}-${address}`,
          lens: { kind: "lv", key },
          state: { zoomT, focus: { kind: "focusT", value: focusT } },
        });
      }
    }
  }
  // An empty selection must be visible as a coded problem, never a successful zero-run suite.
  return expanded.length ? expanded : [run];
}
