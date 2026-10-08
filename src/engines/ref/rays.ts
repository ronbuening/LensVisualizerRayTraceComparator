// `rays.trace` as the reference engine answers it: every ray of the request carried through its model by its own
// tracer, and landed on the image plane by the projection every engine of the comparator shares.
import type { RaysTraceData, RaysTraceSpec } from "../../contract/quantities/raysTrace.ts";
import type { ErrorInfo } from "../../contract/result.ts";
import { decodeNdArray } from "../../core/numeric/ndarray.ts";
import type { NdArrayWire } from "../../core/numeric/ndarray.ts";
import { createTraceRecorder } from "../../rays/traceRecorder.ts";
import type { TraceCounts } from "../../rays/traceRecorder.ts";
import type { RefSystem } from "./model.ts";
import { traceSurfaces } from "./trace.ts";

/** What the engine makes of a `rays.trace` spec: the trace with its ray counts, or why the spec cannot be traced. */
export type RefRaysAnswer =
  { readonly data: RaysTraceData; readonly counts: TraceCounts } | { readonly error: ErrorInfo };

/** The elements of a float64 array of a spec. */
function f8Of(wire: NdArrayWire, name: string): Float64Array {
  const decoded = decodeNdArray(wire);
  if (decoded.dtype !== "f8") throw new Error(`${name} is ${decoded.dtype}, not f8`);
  return decoded.values;
}

/**
 * Traces the rays of a `rays.trace` spec through a model, with the indices of the spec's line.
 *
 * Each ray is carried through the surfaces (`traceSurfaces`). One that passed them all leaves the last surface at
 * its hit there, along its direction behind it, and is landed on the model's image plane by the comparator's own
 * projection, its optical path continued over the landing's distance in the index behind the last surface: status
 * ok, or blocked with the number of surfaces as its end surface when it does not reach the plane. One that did not
 * pass a surface ends there, blocked or failed as the tracer says, with a hit on every surface before it and NaN
 * from that surface on.
 *
 * A spec whose line is not a line of the case is answered with the error `bad-spec`.
 */
export function answerRays(system: RefSystem, spec: RaysTraceSpec): RefRaysAnswer {
  if (spec.line >= system.indexAfter.length) {
    const message = `spec.line is ${spec.line}, and the case has ${system.indexAfter.length} lines`;
    return { error: { code: "bad-spec", message } };
  }
  const indexAfter = system.indexAfter[spec.line];
  const origins = f8Of(spec.origins, "origins");
  const directions = f8Of(spec.directions, "directions");
  const rays = origins.length / 3;
  const surfaces = system.surfaces.length;
  const recorder = createTraceRecorder(rays, surfaces, system.imageZ);

  for (let ray = 0; ray < rays; ray++) {
    const trace = traceSurfaces(
      system,
      indexAfter,
      [origins[3 * ray], origins[3 * ray + 1], origins[3 * ray + 2]],
      [directions[3 * ray], directions[3 * ray + 1], directions[3 * ray + 2]],
    );
    trace.hits.forEach((point, surface) => recorder.hit(ray, surface, point));
    if (trace.status !== "ok") {
      recorder.stop(ray, trace.status, trace.endSurface);
      continue;
    }
    recorder.exit(ray, trace.hits[surfaces - 1], trace.direction, trace.opticalPath, indexAfter[surfaces - 1]);
  }
  return recorder.finish();
}
