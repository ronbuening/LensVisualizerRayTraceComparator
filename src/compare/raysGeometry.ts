// The comparator of `rays.trace` for rung R2: where the same rays went in two engines. Positions and directions are
// compared on the rays that are ok in both; which rays got through is compared on every ray neither engine failed.
import type { SurfaceAperture } from "../contract/case.ts";
import type { JsonObject } from "../contract/json.ts";
import { RAYS_TRACE, RAY_STATUS, RIM_BAND_MM } from "../contract/quantities/raysTrace.ts";
import type { ComparatorOutcome, ComparisonContext, ComputedMetric, QuantityComparator } from "./comparator.ts";
import { decodeTrace, differentRays, noWorst, okInBoth, placeOf, takeWorst, whereOf } from "./raysRead.ts";
import type { DecodedTrace, Where } from "./raysRead.ts";

/** Why the positions of two answers were not measured, when no ray is ok in both. */
export const NO_COMMON_RAY = "no ray is ok in both answers";

/** How many rays are in a group, and the first of them. */
interface Tally {
  count: number;
  ray: number;
  surface: number;
}

function countMetric(name: string, tally: Tally, place: Where): ComputedMetric {
  return { name, value: tally.count, ...(tally.count === 0 ? {} : { where: whereOf(place, tally) }) };
}

/** Whether a hit at the radial height `r` lies in the rim band of an aperture (`RIM_BAND_MM`). */
function inRimBand(aperture: SurfaceAperture, r: number): boolean {
  if (Math.abs(r - aperture.semiDiameter) <= RIM_BAND_MM) return true;
  return aperture.innerSemiDiameter > 0 && Math.abs(r - aperture.innerSemiDiameter) <= RIM_BAND_MM;
}

/** The surface a ray ended at; beyond every surface for a ray that is ok. */
function endOf(trace: DecodedTrace, ray: number): number {
  return trace.status[ray] === RAY_STATUS.ok ? Infinity : trace.endSurface[ray];
}

function compare(dataA: JsonObject, dataB: JsonObject, context?: ComparisonContext): ComparatorOutcome {
  const [a, b] = [decodeTrace(dataA), decodeTrace(dataB)];
  const different = differentRays(a, b);
  if (different !== null) return { comparable: false, reason: different };
  const surfaces = context?.opticalCase?.system.surfaces;
  if (surfaces === undefined) {
    return { comparable: false, reason: "the case is not at hand: its clip radii say which rays lie in the rim band" };
  }
  if (surfaces.length !== a.surfaces) {
    const reason = `the answers are for ${a.surfaces} surfaces, and the case has ${surfaces.length}`;
    return { comparable: false, reason };
  }
  const place = placeOf(context?.spec);
  const { rays } = a;

  // Which rays got through. A ray either engine failed says nothing about the light, and is in neither count.
  const mismatches: Tally = { count: 0, ray: -1, surface: -1 };
  const rimBand: Tally = { count: 0, ray: -1, surface: -1 };
  for (let ray = 0; ray < rays; ray++) {
    if (a.status[ray] === RAY_STATUS.failed || b.status[ray] === RAY_STATUS.failed) continue;
    const [endA, endB] = [endOf(a, ray), endOf(b, ray)];
    if (endA === endB) continue;
    // The first surface the two disagree at: one engine stopped the ray there, and the other has a hit on it.
    const surface = Math.min(endA, endB);
    let rim = false;
    if (surface < surfaces.length) {
      const passed = endA > endB ? a : b;
      const at = (surface * rays + ray) * 3;
      const r = Math.sqrt(passed.hits[at] * passed.hits[at] + passed.hits[at + 1] * passed.hits[at + 1]);
      rim = inRimBand(surfaces[surface].aperture, r);
    }
    const tally = rim ? rimBand : mismatches;
    if (tally.count++ === 0) Object.assign(tally, { ray, surface });
  }

  const both = okInBoth(a, b);
  const counts = [
    countMetric("mask.mismatches", mismatches, place),
    countMetric("mask.rimBand", rimBand, place),
    { name: "rays.compared", value: both.length },
  ];
  if (both.length === 0) {
    const unmeasured = ["hits.maxDistance", "direction.maxAbs", "landing.maxDistance"].map((name) => ({
      name,
      reason: NO_COMMON_RAY,
    }));
    return { comparable: true, metrics: counts, unmeasured };
  }

  const hits = noWorst();
  for (let surface = 0; surface < a.surfaces; surface++) {
    for (const ray of both) {
      const at = (surface * rays + ray) * 3;
      const [dx, dy, dz] = [a.hits[at] - b.hits[at], a.hits[at + 1] - b.hits[at + 1], a.hits[at + 2] - b.hits[at + 2]];
      takeWorst(hits, Math.sqrt(dx * dx + dy * dy + dz * dz), ray, surface);
    }
  }
  const direction = noWorst();
  const landing = noWorst();
  for (const ray of both) {
    for (let axis = 0; axis < 3; axis++) {
      takeWorst(direction, Math.abs(a.exitDirection[3 * ray + axis] - b.exitDirection[3 * ray + axis]), ray);
    }
    const [dx, dy] = [
      a.imagePoint[3 * ray] - b.imagePoint[3 * ray],
      a.imagePoint[3 * ray + 1] - b.imagePoint[3 * ray + 1],
    ];
    const dz = a.imagePoint[3 * ray + 2] - b.imagePoint[3 * ray + 2];
    takeWorst(landing, Math.sqrt(dx * dx + dy * dy + dz * dz), ray);
  }
  return {
    comparable: true,
    metrics: [
      { name: "hits.maxDistance", value: hits.value, where: whereOf(place, hits) },
      { name: "direction.maxAbs", value: direction.value, where: whereOf(place, direction) },
      { name: "landing.maxDistance", value: landing.value, where: whereOf(place, landing) },
      ...counts,
    ],
  };
}

/** How many rays of an answer ended in each way: what a comparison lists beside its metrics, for each engine. */
function recorded(data: JsonObject): { readonly [name: string]: readonly number[] } {
  const { status } = decodeTrace(data);
  const count = (value: number): number => status.reduce((total, each) => total + (each === value ? 1 : 0), 0);
  return {
    "rays.ok": [count(RAY_STATUS.ok)],
    "rays.blocked": [count(RAY_STATUS.blocked)],
    "rays.failed": [count(RAY_STATUS.failed)],
  };
}

/**
 * The comparator of `rays.trace` for rung R2: the geometry of the same rays in two engines.
 *
 * Three metrics are of the rays that are ok in both answers, each with the `ray` of its largest value in `where`,
 * the first on a tie, beside the `line` and the `field` of the set (`placeOf`):
 *
 * - `hits.maxDistance`: the largest distance between the two hits of a ray on a surface, in mm, over every
 *   surface; `where` has the `surface` too;
 * - `direction.maxAbs`: the largest difference of a component of the unit direction behind the last surface;
 * - `landing.maxDistance`: the largest distance between the two points on the image plane, in mm.
 *
 * Where no ray is ok in both, the three are not measured (`NO_COMMON_RAY`).
 *
 * Two count the rays the engines disagree about: one of them stopped the ray at a surface that the other let it
 * pass. A ray that both stopped at one surface is no disagreement, whatever each calls the reason; a ray that
 * either engine failed is in neither count, since a failure says nothing about the light. A disagreement is at the
 * first surface the two part at, where the engine that passed the ray has a hit:
 *
 * - `mask.rimBand`: the disagreements whose hit lies within `RIM_BAND_MM` of the surface's clip radius, or of the
 *   radius of its central obstruction. They are counted and never judged;
 * - `mask.mismatches`: every other disagreement, one at the image plane among them: a ray that passed every
 *   surface in both engines and reaches the plane in only one.
 *
 * Each has the `ray` and the `surface` of its first ray in `where`. `rays.compared` is how many rays are ok in
 * both. `recorded(data)` gives how many rays of one answer are ok, blocked and failed.
 *
 * Answers for different numbers of rays or of surfaces are not comparable, and no two answers are without the
 * case, whose apertures say where a rim is.
 */
export const raysGeometryComparator: QuantityComparator = Object.freeze({
  quantity: RAYS_TRACE,
  rung: "r2",
  metrics: Object.freeze([
    { name: "hits.maxDistance", unit: "mm" },
    { name: "direction.maxAbs", unit: "1" },
    { name: "landing.maxDistance", unit: "mm" },
    { name: "mask.mismatches", unit: "rays" },
    { name: "mask.rimBand", unit: "rays" },
    { name: "rays.compared", unit: "rays" },
  ]),
  compare,
  recorded,
});
