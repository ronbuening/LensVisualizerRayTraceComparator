// The quantity `rays.trace`: its schema files, and the rules they cannot state.
import {
  DIRECTION_NORM_TOLERANCE,
  NO_END_SURFACE,
  RAYS_TRACE,
  RAYS_TRACE_VERSION,
  RAY_STATUS,
} from "../contract/quantities/raysTrace.ts";
import type { RaysTraceData, RaysTraceSpec } from "../contract/quantities/raysTrace.ts";
import type { ValidationIssue } from "../contract/validate.ts";
import { decodeNdArray } from "../core/numeric/ndarray.ts";
import type { NdArrayWire, NdValues } from "../core/numeric/ndarray.ts";
import { invariantIssue, schemaQuantity } from "./module.ts";
import type { QuantityModule } from "./module.ts";

function shapeText(shape: readonly number[]): string {
  return `[${shape.join(", ")}]`;
}

/** The elements of an array, or the issue that says why its bytes are not the array it states. */
function decoded(path: string, wire: NdArrayWire, issues: ValidationIssue[]): NdValues | null {
  try {
    return decodeNdArray(wire).values;
  } catch (error) {
    issues.push(invariantIssue(path, error instanceof Error ? error.message : String(error)));
    return null;
  }
}

/** Whether the three components of row `row` of an `[n, 3]` array are all finite numbers. */
function finiteRow(values: NdValues, row: number): boolean {
  return (
    Number.isFinite(values[3 * row]) && Number.isFinite(values[3 * row + 1]) && Number.isFinite(values[3 * row + 2])
  );
}

/** Whether the three components of row `row` of an `[n, 3]` array are all NaN. */
function nanRow(values: NdValues, row: number): boolean {
  return Number.isNaN(values[3 * row]) && Number.isNaN(values[3 * row + 1]) && Number.isNaN(values[3 * row + 2]);
}

/**
 * The rays of a spec are one set: `origins` and `directions` are `[n, 3]` and `weights` is `[n]`, for one n of at
 * least 1; every origin is finite; every direction is a unit vector, within `DIRECTION_NORM_TOLERANCE`, with a z
 * component above 0; every weight is finite and not negative; a chief ray is one of the n rays and a lattice has no
 * more cells than there are rays. Each array reports the first ray that breaks its rule.
 */
function specInvariants(value: unknown): ValidationIssue[] {
  const spec = value as RaysTraceSpec;
  const issues: ValidationIssue[] = [];
  const [rays] = spec.origins.$nd.shape;
  if (rays < 1) return [invariantIssue("/origins", "it holds no ray: a set has at least one")];
  for (const name of ["origins", "directions"] as const) {
    const { shape } = spec[name].$nd;
    if (shape[0] !== rays || shape[1] !== 3) {
      issues.push(invariantIssue(`/${name}`, `its shape is ${shapeText(shape)}, expected [${rays}, 3] (rays, xyz)`));
    }
  }
  const weightShape = spec.weights.$nd.shape;
  if (weightShape[0] !== rays) {
    issues.push(invariantIssue("/weights", `its shape is ${shapeText(weightShape)}, expected [${rays}] (rays)`));
  }
  if (issues.length > 0) return issues;

  const origins = decoded("/origins", spec.origins, issues);
  const directions = decoded("/directions", spec.directions, issues);
  const weights = decoded("/weights", spec.weights, issues);
  if (origins === null || directions === null || weights === null) return issues;

  const first = (broken: (ray: number) => boolean): number => {
    for (let ray = 0; ray < rays; ray++) if (broken(ray)) return ray;
    return -1;
  };
  const stray = first((ray) => !finiteRow(origins, ray));
  if (stray >= 0) issues.push(invariantIssue("/origins", `the origin of ray ${stray} is not finite`));
  const skewed = first((ray) => {
    const [x, y, z] = [directions[3 * ray], directions[3 * ray + 1], directions[3 * ray + 2]];
    return !(Math.abs(Math.sqrt(x * x + y * y + z * z) - 1) <= DIRECTION_NORM_TOLERANCE) || !(z > 0);
  });
  if (skewed >= 0) {
    const message = `the direction of ray ${skewed} is not a unit vector with a z component above 0`;
    issues.push(invariantIssue("/directions", message));
  }
  const weightless = first((ray) => !(Number.isFinite(weights[ray]) && weights[ray] >= 0));
  if (weightless >= 0) {
    issues.push(invariantIssue("/weights", `the weight of ray ${weightless} is not a finite number of at least 0`));
  }

  const { chiefIndex, lattice } = spec.groups ?? {};
  if (chiefIndex !== undefined && chiefIndex >= rays) {
    issues.push(invariantIssue("/groups/chiefIndex", `${chiefIndex} is not the index of one of the ${rays} rays`));
  }
  if (lattice !== undefined && lattice.columns * lattice.rows > rays) {
    const cells = `${lattice.columns} x ${lattice.rows}`;
    issues.push(invariantIssue("/groups/lattice", `a lattice of ${cells} cells needs more than the ${rays} rays`));
  }
  return issues;
}

/**
 * The parts of an answer are the trace of one set of n rays through S surfaces: `status` and `endSurface` are
 * `[n]`, `hits` is `[S, n, 3]` with S of at least 1, the three point arrays are `[n, 3]` and the two paths `[n]`.
 * Then, ray by ray:
 *
 * - `status` is one of `RAY_STATUS`; `endSurface` is -1 exactly for a ray that is ok, and else from 0 to S;
 * - a ray that is ok has a number everywhere;
 * - any other ray has a hit on every surface before its end surface and NaN from there on; its exit point, exit
 *   direction and optical path are numbers when it passed every surface (its end surface is S) and NaN otherwise;
 *   its image point and its optical path to the image are NaN.
 *
 * Each rule reports the first ray that breaks it.
 */
function dataInvariants(value: unknown): ValidationIssue[] {
  const data = value as RaysTraceData;
  const issues: ValidationIssue[] = [];
  const [rays] = data.status.$nd.shape;
  const [surfaces] = data.hits.$nd.shape;
  if (rays < 1) return [invariantIssue("/status", "it holds no ray: a set has at least one")];
  const expect = (name: keyof RaysTraceData, expected: readonly number[], said: string): void => {
    const { shape } = data[name].$nd;
    if (shape.length !== expected.length || shape.some((extent, axis) => extent !== expected[axis])) {
      issues.push(invariantIssue(`/${name}`, `its shape is ${shapeText(shape)}, expected ${said}`));
    }
  };
  if (surfaces < 1) issues.push(invariantIssue("/hits", "it holds no surface: a case has at least one"));
  else expect("hits", [surfaces, rays, 3], `[${surfaces}, ${rays}, 3] (surfaces, rays, xyz)`);
  expect("endSurface", [rays], `[${rays}] (rays)`);
  for (const name of ["exitPoint", "exitDirection", "imagePoint"] as const) {
    expect(name, [rays, 3], `[${rays}, 3] (rays, xyz)`);
  }
  for (const name of ["opticalPath", "opticalPathToImage"] as const) expect(name, [rays], `[${rays}] (rays)`);
  if (issues.length > 0) return issues;

  const status = decoded("/status", data.status, issues);
  const endSurface = decoded("/endSurface", data.endSurface, issues);
  const hits = decoded("/hits", data.hits, issues);
  const exitPoint = decoded("/exitPoint", data.exitPoint, issues);
  const exitDirection = decoded("/exitDirection", data.exitDirection, issues);
  const imagePoint = decoded("/imagePoint", data.imagePoint, issues);
  const opticalPath = decoded("/opticalPath", data.opticalPath, issues);
  const toImage = decoded("/opticalPathToImage", data.opticalPathToImage, issues);
  if (
    status === null ||
    endSurface === null ||
    hits === null ||
    exitPoint === null ||
    exitDirection === null ||
    imagePoint === null ||
    opticalPath === null ||
    toImage === null
  ) {
    return issues;
  }

  // One issue per member, for the first ray that breaks the member's rule.
  const reported = new Set<string>();
  const report = (path: string, message: string): void => {
    if (reported.has(path)) return;
    reported.add(path);
    issues.push(invariantIssue(path, message));
  };
  const statuses: readonly number[] = Object.values(RAY_STATUS);
  for (let ray = 0; ray < rays; ray++) {
    const ok = status[ray] === RAY_STATUS.ok;
    const end = endSurface[ray];
    if (!statuses.includes(status[ray])) report("/status", `the status of ray ${ray} is ${status[ray]}`);
    if (ok ? end !== NO_END_SURFACE : !(end >= 0 && end <= surfaces)) {
      const expected = ok ? `${NO_END_SURFACE}, as for every ray that is ok` : `from 0 to ${surfaces}`;
      report("/endSurface", `the end surface of ray ${ray} is ${end}, expected ${expected}`);
      continue;
    }
    // A ray that is ok ends behind every surface, on the image plane.
    const reached = ok ? surfaces : end;
    for (let surface = 0; surface < surfaces; surface++) {
      const row = surface * rays + ray;
      if (surface < reached ? !finiteRow(hits, row) : !nanRow(hits, row)) {
        const expected = surface < reached ? "a point" : "NaN: the ray ended before it";
        report("/hits", `the hit of ray ${ray} on surface ${surface} is not ${expected}`);
        break;
      }
    }
    const left = reached === surfaces;
    const said = left ? "a number" : "NaN: the ray did not pass the last surface";
    if (left ? !finiteRow(exitPoint, ray) : !nanRow(exitPoint, ray)) {
      report("/exitPoint", `the exit point of ray ${ray} is not ${said}`);
    }
    if (left ? !finiteRow(exitDirection, ray) : !nanRow(exitDirection, ray)) {
      report("/exitDirection", `the exit direction of ray ${ray} is not ${said}`);
    }
    if (left ? !Number.isFinite(opticalPath[ray]) : !Number.isNaN(opticalPath[ray])) {
      report("/opticalPath", `the optical path of ray ${ray} is not ${said}`);
    }
    const landed = ok ? "a number" : "NaN: the ray did not reach the image plane";
    if (ok ? !finiteRow(imagePoint, ray) : !nanRow(imagePoint, ray)) {
      report("/imagePoint", `the image point of ray ${ray} is not ${landed}`);
    }
    if (ok ? !Number.isFinite(toImage[ray]) : !Number.isNaN(toImage[ray])) {
      report("/opticalPathToImage", `the optical path to the image of ray ${ray} is not ${landed}`);
    }
  }
  return issues;
}

/**
 * The quantity `rays.trace`, validated by its two schema files and then by what they cannot state: a spec's arrays
 * are one set of rays with unit directions and usable weights, and an answer's arrays are one trace in which every
 * ray has numbers up to where it ended and NaN from there on.
 */
export const raysTraceQuantity: QuantityModule = schemaQuantity(RAYS_TRACE, RAYS_TRACE_VERSION, {
  spec: specInvariants,
  data: dataInvariants,
});
