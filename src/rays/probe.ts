// Probe rays for a case that is known only as a case: lattices laid over the clear aperture of the first surface
// and a little past its rim, so that most rays enter the lens and some are stopped at once. They are made from the
// case alone, by the same arithmetic on every machine, and are what a case read from a file is traced with.
import type { OpticalCase, SurfaceIR } from "../contract/case.ts";
import type { RaysTraceSpec } from "../contract/quantities/raysTrace.ts";
import type { RunFields, RunSampling } from "../contract/runSpec.ts";
import { profileOf, sag } from "../engines/ref/surface.ts";
import { collimatedGrid, divergingGrid } from "./generators.ts";
import type { LatticeBundle, Vec3 } from "./generators.ts";
import { DEFAULT_BUNDLE_GRID, DEFAULT_RAY_FIELDS, rayProblem, raySetSpec } from "./raySets.ts";
import type { RaySetResolution } from "./raySets.ts";

/**
 * How far a probe lattice reaches, in clip radii of the first surface: an eighth past the rim on every side. The
 * cells of its corners, and the outermost ones of its sides, lie outside the clear aperture.
 */
export const PROBE_SPAN = 1.125;

/** How far in front of the first surface a collimated probe lattice starts, mm. */
export const LAUNCH_LEAD_MM = 10;

/** The radii at which the first surface is sampled for the point of it that lies furthest forward. */
const FRONT_SAMPLES = 256;

/**
 * The z of the front of a first surface: the smallest z it has anywhere within its clear aperture, which is its
 * vertex for a surface that is convex toward the object and its rim for one that is concave. The sag is sampled
 * at `FRONT_SAMPLES` radii from the vertex to the clip radius, or to the height at which the surface's conic ends
 * where that comes first: the last sample is the rim itself. What the sag formula gives beyond the clear aperture
 * is not looked at: a polynomial fitted to a clear aperture diverges outside it, and no glass is there.
 */
export function firstSurfaceFrontZ(first: SurfaceIR): number {
  const profile = profileOf(first.shape);
  // A conic has no sag beyond 1 / (|c| sqrt(1 + K)); a hair inside that height it still has one.
  const closing = (1 + profile.conic) * profile.curvature * profile.curvature;
  const end = closing > 0 ? (1 - 1e-12) / Math.sqrt(closing) : Infinity;
  const reach = Math.min(first.aperture.semiDiameter, end);
  let least = 0;
  for (let sample = 1; sample <= FRONT_SAMPLES; sample++) {
    const z = sag(profile, (reach * sample) / FRONT_SAMPLES);
    if (z < least) least = z;
  }
  return first.z + least;
}

/**
 * Whether every ray of a set starts in front of the first surface: its origin is finite, and the z of it is below
 * the front of the surface (`firstSurfaceFrontZ`), so that the ray has all of the first element's glass ahead of
 * it, whatever its direction and however far from the axis it starts. `origins` holds x, y, z of each ray in turn.
 */
export function startsInFront(first: SurfaceIR, origins: Float64Array): boolean {
  const front = firstSurfaceFrontZ(first);
  for (let ray = 0; ray < origins.length / 3; ray++) {
    const [x, y, z] = [origins[3 * ray], origins[3 * ray + 1], origins[3 * ray + 2]];
    if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z) || !(z < front)) return false;
  }
  return true;
}

/** The field angles of a run's fields, in degrees, or the problem of a field a case alone cannot place. */
function fieldAngles(fields: RunFields): ({ angleDeg: number; heightFraction?: number } | { problem: string })[] {
  if (fields.kind === "angles-deg") return fields.values.map((angleDeg) => ({ angleDeg }));
  return fields.values.map((heightFraction) => {
    if (heightFraction === 0) return { angleDeg: 0, heightFraction };
    return {
      problem: rayProblem(
        "field-fraction-unresolved",
        `a case read from a file states no image height to take the fraction ${heightFraction} of; ` +
          "state the field as an angle (fields of kind angles-deg)",
      ),
    };
  });
}

/**
 * The probe lattice of one field of a case: collimated for an object at infinity, and from the object point for a
 * finite one, which lies at the height `-object.z * tan(angle)` on the object plane: the field angle is measured at
 * the first vertex, and a positive angle is an object toward +y. The lattice is laid on the first surface's vertex
 * plane, centred on the axis, with `PROBE_SPAN` times the surface's clip radius as its half width. A collimated
 * lattice starts on the plane `LAUNCH_LEAD_MM` in front of the first surface (`firstSurfaceFrontZ`), which for a
 * surface that is concave toward the object is in front of its rim. Null when a ray would not start in front of the
 * first surface (`startsInFront`): an object point that lies inside the bowl of a concave first surface.
 */
export function probeLattice(opticalCase: OpticalCase, fieldAngleDeg: number, cells: number): LatticeBundle | null {
  const [first] = opticalCase.system.surfaces;
  const { object } = opticalCase.conditions;
  const placement = { cells, halfWidth: PROBE_SPAN * first.aperture.semiDiameter, planeZ: first.z };
  let bundle: LatticeBundle;
  if (object.kind === "finite") {
    const height = (first.z - object.z) * Math.tan((fieldAngleDeg * Math.PI) / 180);
    const objectPoint: Vec3 = [0, height + 0, object.z];
    bundle = divergingGrid({ ...placement, objectPoint });
  } else {
    const launchZ = firstSurfaceFrontZ(first) - LAUNCH_LEAD_MM;
    bundle = collimatedGrid({ ...placement, fieldAngleDeg, launchZ });
  }
  return startsInFront(first, bundle.origins) ? bundle : null;
}

/** The coded problem of a field whose rays would not start in front of the first surface. */
export function launchBehindProblem(fieldAngleDeg: number): string {
  const message = `the rays of the field at ${fieldAngleDeg} degrees would not start in front of the first surface`;
  return rayProblem("launch-behind-first-surface", message);
}

/**
 * The probe ray sets of a case: for every field of `fields` (`DEFAULT_RAY_FIELDS` without them) one lattice
 * (`probeLattice`) of `sampling.bundleGrid` cells across (`DEFAULT_BUNDLE_GRID` without it; an odd number is raised
 * to the next even one), traced at every line of the case. The rays of a field are the same at every line; only
 * the line index differs. Each set states its field and its lattice under `groups`, and has no chief ray.
 *
 * A field has no set, and a coded problem instead, when it is an image-height fraction other than 0
 * (`field-fraction-unresolved`: a case states no image height, so only the axis can be placed), and when its rays
 * would not start in front of the first surface (`launch-behind-first-surface`).
 */
export function probeRaySets(
  opticalCase: OpticalCase,
  options: { readonly fields?: RunFields; readonly sampling?: Pick<RunSampling, "bundleGrid"> } = {},
): RaySetResolution {
  const cells = options.sampling?.bundleGrid ?? DEFAULT_BUNDLE_GRID;
  const sets: RaysTraceSpec[] = [];
  const problems: string[] = [];
  for (const field of fieldAngles(options.fields ?? DEFAULT_RAY_FIELDS)) {
    if ("problem" in field) {
      problems.push(field.problem);
      continue;
    }
    const bundle = probeLattice(opticalCase, field.angleDeg, cells);
    if (bundle === null) {
      problems.push(launchBehindProblem(field.angleDeg));
      continue;
    }
    const { columns, rows, step } = bundle;
    const groups = { field, lattice: { columns, rows, step } };
    // One encoding serves every line: the rays are the same, and so are their bytes.
    const { origins, directions, weights } = raySetSpec(0, bundle);
    opticalCase.conditions.lines.forEach((_line, line) => sets.push({ line, origins, directions, weights, groups }));
  }
  return { sets, problems };
}
