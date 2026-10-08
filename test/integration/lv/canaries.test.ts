// Source canaries: the lines of LensVisualizer's own source that the exporter and the engine `lv` mirror or rely on,
// pinned as text at LV commit d36f44b3. LensVisualizer exports none of these rules as a function, so the comparator
// restates them; when LV rewrites one, the canary fails and names what to read again. Whitespace is not compared.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import { LV_PATH, LV_UNAVAILABLE } from "./support.ts";

const skip = LV_UNAVAILABLE;

function squeezed(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

/** Fails, saying what mirrors the expression, unless the LensVisualizer file still holds it. */
function assertSource(file: string, expression: string, mirroredBy: string): void {
  const source = squeezed(readFileSync(join(LV_PATH ?? "", ...file.split("/")), "utf8"));
  assert.ok(
    source.includes(squeezed(expression)),
    `LensVisualizer changed: ${file} no longer holds\n  ${squeezed(expression)}\n` +
      `The comparator relies on it: ${mirroredBy}. Read the file again and bring the comparator in line with it.`,
  );
}

/** How often a LensVisualizer file holds a text. */
function occurrences(file: string, text: string): number {
  return squeezed(readFileSync(join(LV_PATH ?? "", ...file.split("/")), "utf8")).split(squeezed(text)).length - 1;
}

test("the hook still stops down linearly: wide-open radius times the widest f-number, divided by N", { skip }, () => {
  const hook = "src/components/hooks/useLensComputation.ts";
  const mirror = "stopRadius in src/engines/lv/exportAperture.ts restates the rule, in this order of operations";
  assertSource(hook, "const currentFOPEN = L ? fopenAtZoom(zoomT, L) : 1;", mirror);
  assertSource(hook, "const wideOpenStopSD = L ? wideOpenStopAtZoom(zoomT, L) : 0;", mirror);
  assertSource(hook, "const currentPhysStopSD = L ? (wideOpenStopSD * currentFOPEN) / fNumber : 0;", mirror);
  // The hook's fopenAtZoom is the function the binding imports as fopenAtZoom2, and its f-number never goes below it.
  assertSource(
    "src/optics/optics.ts",
    "fopenAtZoom2 as fopenAtZoom,",
    "the binding takes fopenAtZoom2 for the hook's fopenAtZoom",
  );
  assertSource(
    "src/optics/aperture.ts",
    "return Math.max(requested, fopenAtZoom2(zoomT, L));",
    "stopRadius reports an f-number below the widest as a problem, where the hook clamps it",
  );
});

test("the support gate still rejects a path for the causes the exporter names, and for no other", { skip }, () => {
  const gate = "src/optics/analysis/mtfSupport.ts";
  const mirror =
    "structuralProblems in src/engines/lv/exportCase.ts names each cause, and pathIsExpressible in exportLines.ts " +
    "takes a fisheye projection and an annular aperture for the only ones a case can still be exported with";
  assertSource(
    gate,
    `lens.flags.isFoldedOptics ||
     lens.source.projection?.kind?.startsWith("fisheye") ||
     state.surfaces.some((s) => s.diffractive || (s.innerSd ?? 0) > 0 || s.interaction.type !== "refract")`,
    mirror,
  );
  assertSource(
    gate,
    `Math.abs(state.imagePlane.normal[0]) > 1e-10 ||
     Math.abs(state.imagePlane.normal[1]) > 1e-10 ||
     state.imagePlane.normal[2] <= 0`,
    mirror,
  );
  assert.equal(occurrences(gate, 'reject("unsupported-path"'), 2, `${gate} rejects a path in another number of places`);
  assertSource(
    gate,
    "if (state.focusT !== 0) { const conjugate = mtfFiniteConjugate(state);",
    "exportLight in src/engines/lv/exportLines.ts takes focus position 0 for infinity focus and asks for a conjugate elsewhere",
  );
});

test(
  "the tracers still read the authored index where no resolver is given, and the resolver still says when",
  { skip },
  () => {
    const mirror = "exportLight writes surface.nd, as 'authored', for a line that mtfIndexResolver gives no resolver";
    assertSource(
      "src/optics/trace/sequentialTrace.ts",
      "const nn = indexAtSurface ? indexAtSurface(i, surface.nd) : surface.nd === 1 ? 1 : surface.nd;",
      mirror,
    );
    assertSource("src/optics/analysis/mtfTracing.ts", "if (!support.useResolvedReference) return undefined;", mirror);
    assertSource(
      "src/optics/trace/aperture.ts",
      "if (surface.physicalIndex === state.lens.stop.surfaceIndex && stopSemiDiameter !== undefined) return stopSemiDiameter;",
      "surfaceAperture in src/engines/lv/exportAperture.ts hands the run's stop radius to evaluateAperture for the stop surface",
    );
  },
);

test("a flat surface is still one whose radius exceeds 1e10 and that has no asphere", { skip }, () => {
  const mirror =
    "surfaceShape in src/engines/lv/exportShape.ts (LV_FLAT_RADIUS) decides plane, conic and asphere by it";
  assertSource("src/optics/internal/surfaceMath.ts", "export const FLAT_R_THRESHOLD = 1e10;", mirror);
  assertSource(
    "src/optics/math/surfaceProfile.ts",
    "if (Math.abs(surface.R) > FLAT_R_THRESHOLD && !asphere) { return createFlatProfile(); }",
    mirror,
  );
});

test(
  "a point beyond a profile's finite radius limit is still no surface, though the sag there is a number",
  { skip },
  () => {
    const mirror =
      "sagOf in src/engines/lv/describe.ts reports NaN beyond finiteRadiusLimit, where the profile's sag is finite";
    assertSource(
      "src/optics/math/intersection.ts",
      "if (domainRadius !== null && radius > domainRadius) return { t, point, radius, value: NaN, derivative: NaN };",
      mirror,
    );
    assertSource("src/optics/math/intersection.ts", "const domainRadius = profile.finiteRadiusLimit();", mirror);
    // The clamp that keeps the sag finite out there, and the conic and curvature the sag is evaluated with.
    assertSource(
      "src/optics/internal/surfaceMath.ts",
      "const conic = (c * h2) / (1 + Math.sqrt(d > 0 ? d : 1e-12));",
      mirror,
    );
    const shape = "describeLvSystem in src/engines/lv/describe.ts reads the curvature and the conic constant this way";
    assertSource(
      "src/optics/internal/surfaceMath.ts",
      "const c = Math.abs(R) > FLAT_R_THRESHOLD ? 0 : 1.0 / R;",
      shape,
    );
    assertSource("src/optics/internal/surfaceMath.ts", "const K = asph ? asph.K : 0;", shape);
    assertSource(
      "src/optics/internal/surfaceMath.ts",
      "even: Float64Array.from(EVEN_TERM_PLANS, (term) => coefficientOf(asph, term.key)),",
      "termsOf in src/engines/lv/describe.ts takes the coefficients of ASPHERIC_POLYNOMIAL_TERMS, as the sag does",
    );
  },
);

test(
  "the paraxial kernel still starts in air and stops in front of the surface it is told to stop at",
  { skip },
  () => {
    const kernel = "src/optics/math/paraxial.ts";
    const mirror =
      "lineValues in src/engines/lv/firstOrder.ts images the stop with it: to the stop's plane by stopAt, and from " +
      "the stop through a plane that puts the ray into the stop's own medium";
    assertSource(kernel, "const tracedCount = stopAt !== undefined ? stopAt : surfaces.length;", mirror);
    assertSource(kernel, "let state: ParaxialState = { y: y0, u: u0, n: 1 };", mirror);
    assertSource(kernel, "if (isLast && skipLastTransfer) continue;", mirror);
    assertSource(
      kernel,
      "const refractivePower = Math.abs(surface.R) < FLAT_R_THRESHOLD ? (nextN - n) / surface.R : 0;",
      mirror,
    );
  },
);

test(
  "LensVisualizer still assembles the system matrix, the cardinal points and the entrance pupil as lv does",
  { skip },
  () => {
    const mirror =
      "lineValues in src/engines/lv/firstOrder.ts assembles the same from the kernel, with a line's indices";
    const matrix = "src/optics/first-order/systemMatrix.ts";
    assertSource(
      matrix,
      "const marginal = traceParaxialSurfaces2(state.surfaces, 1, 0, { skipLastTransfer: true });",
      mirror,
    );
    assertSource(
      matrix,
      "const chief = traceParaxialSurfaces2(state.surfaces, 0, 1, { skipLastTransfer: true });",
      mirror,
    );
    assertSource(matrix, "A: marginal.y, B: chief.y, C: imageIndex * marginal.u, D: imageIndex * chief.u,", mirror);
    const cardinals = "src/optics/first-order/cardinals.ts";
    assertSource(
      cardinals,
      `frontVertexZ: state.z[0],
     rearVertexZ: state.z[state.surfaces.length - 1],`,
      mirror,
    );
    assertSource(
      cardinals,
      "rearLensVertexZ: state.z[state.lens.runtime.lastLensSurfaceIdx ?? state.surfaces.length - 1],",
      mirror,
    );
    const pupils = "src/optics/first-order/pupils.ts";
    assertSource(
      pupils,
      "const marginal = traceParaxialSurfaces2(state.surfaces, 1, 0, { stopAt: stopIndex });",
      mirror,
    );
    assertSource(pupils, "const chief = traceParaxialSurfaces2(state.surfaces, 0, 1, { stopAt: stopIndex });", mirror);
  },
);

test(
  "the stored pupil constants are still drawn from the stop vertex and the last vertex, at the zoom position",
  { skip },
  () => {
    const overlay = "src/components/diagram/DiagramOverlayLayer.tsx";
    const mirror = "storedConstants in src/engines/lv/firstOrder.ts converts them to positions in the same way";
    assertSource(
      overlay,
      `const epSD = epAtZoom(zoomT, L);
     const xpSD = xpAtZoom(zoomT, L);
     const epZRel = epZRelStopAtZoom(zoomT, L);
     const xpZRel = xpZRelLastSurfAtZoom(zoomT, L);`,
      mirror,
    );
    assertSource(overlay, "movedScreenPoint(zPos[L.stopIdx] + epZRel, 0)", mirror);
    assertSource(overlay, "movedScreenPoint(zPos[L.N - 1] + xpZRel, 0)", mirror);
    assertSource(
      "src/optics/optics.ts",
      "epAtZoom2 as epAtZoom,",
      "the binding takes epAtZoom2 for the overlay's epAtZoom",
    );
    // They are found at infinity focus, with real rays and a nominal entrance pupil: recorded, never compared.
    const runtime = "src/optics/runtimeLens.ts";
    const recorded = "answerLvFirstOrder records them only at infinity focus and at a line of authored indices";
    assertSource(runtime, "const epZRelStop = Math.abs(realYRatio) > 1e-9 ? realB / realYRatio - zStop : 0;", recorded);
    assertSource(runtime, "const xpZRelLastSurf = Math.abs(xpU) > 1e-9 ? -xpY / xpU : Infinity;", recorded);
  },
);

test(
  "the MTF bundle still launches a cell where the ray sets launch it, and still weighs it the same way",
  { skip },
  () => {
    const tracing = "src/optics/analysis/mtfTracing.ts";
    const mirror =
      "lvFieldRays in src/engines/lv/raySets.ts lays the rays of a set on these lattice points, with this launch " +
      "weight, and puts the chief ray after them";
    assertSource(tracing, "const chiefRay = mtfLaunchRay(launch, 0, 0);", mirror);
    assertSource(
      tracing,
      `const x = grid.x0 + (column + 0.5) * grid.step;
     const y = grid.y0 + (row + 0.5) * grid.step;
     const trace = traceEngineRay2(state, mtfLaunchRay(launch, x, y), traceOptions);`,
      mirror,
    );
    assertSource(
      tracing,
      "const chiefDistance = source ? Math.hypot(...chiefTrace.input.origin.map((v, i) => v - source[i])) : 0;",
      mirror,
    );
    assertSource(
      tracing,
      `const launchWeight = source
       ? (chiefDistance / Math.hypot(...trace.input.origin.map((v, i) => v - source[i]))) ** 3
       : 1;`,
      mirror,
    );
    assertSource(
      tracing,
      "point.weight *= launchWeight;",
      "lvRayWeights in src/engines/lv/raySets.ts multiplies the weight of mtfImagePoint by the launch weight",
    );
    // The bundle traces half the columns of a lens of revolution; the ray sets hold every cell, and lv traces each.
    assertSource(
      tracing,
      "const firstColumn = mirror ? grid.columns / 2 : 0;",
      "the ray sets hold every cell of the lattice as a ray of its own, where the bundle mirrors half of them",
    );
    assertSource(
      tracing,
      "const columns = 2 * Math.max(1, Math.ceil(halfWidth / step - 1e-9));",
      "the chief ray is no cell of the lattice, whose number of columns is even",
    );
  },
);

test(
  "the MTF still traces a pupil sample with the options lv traces a ray with, and lands it by the same rule",
  { skip },
  () => {
    const tracing = "src/optics/analysis/mtfTracing.ts";
    assertSource(
      tracing,
      `return {
       checkSemiDiameter: true,
       stopSemiDiameter: options.stopSemiDiameterMm,
       stopOnClip: true,
       directionNormalized: true,
       wavelengthNm: line.wavelengthNm,
       recordOpticalPath: opticalPath,
       indexAtSurface: mtfIndexResolver(state, support, line.wavelengthNm),
     };`,
      "lvTraceOptions in src/engines/lv/rays.ts sets the same options, with the indices of the case's line as a table",
    );
    const projection =
      "projectToImagePlane in src/estimators/imageProjection.ts lands a ray by the same arithmetic and takes an exit " +
      "point up to 1e-9 mm behind the plane for a point of it";
    assertSource(
      tracing,
      'if (trace.status !== "ok" || Math.abs(trace.terminalDirection[2]) < 1e-12) return null;',
      projection,
    );
    assertSource(
      tracing,
      `const distance = (imagePlaneZ - trace.terminalPoint[2]) / trace.terminalDirection[2];
     if (!(distance >= -1e-9)) return null;
     const transfer = Math.max(0, distance);`,
      projection,
    );
    assertSource(
      tracing,
      `x: trace.terminalPoint[0] + transfer * trace.terminalDirection[0],
     y: trace.terminalPoint[1] + transfer * trace.terminalDirection[1],
     weight: bulkTransmissionForTrace(state.lens.runtime, trace.hits),`,
      projection,
    );
  },
);

test(
  "the sequential tracer still ends a ray where lv reads its end surface from, and measures the path from the origin",
  { skip },
  () => {
    const tracer = "src/optics/trace/sequentialTrace.ts";
    const mirror =
      "surfacesPassed in src/engines/lv/rays.ts takes the hits before the first clipped one for the surfaces a ray " +
      "passed: a clipped hit is recorded, a total reflection marks its hit clipped, a missed surface has no hit";
    assertSource(
      tracer,
      `if (hitClipped && stopOnClip && !ghost) {
       hits.push(traceHit);
       break;
     }`,
      mirror,
    );
    assertSource(
      tracer,
      `failureReason = interaction.failure.failureReason;
     pushClipEvent(clipEvents, state, i, interaction.failure.clipReason, failureReason);
     traceHit.clipped = true;`,
      mirror,
    );
    assertSource(
      tracer,
      `if (!hit.ok) {
       // A miss is terminal even in ghost mode: prior hits still display, while
       // fabricated fallback points can create unbounded SVG paths.
       clipped = true;
       failureReason = hit.failureReason;`,
      mirror,
    );
    assertSource(
      "src/optics/trace/utils.ts",
      'const status = failureReason !== null ? "failed" : clipped ? "clipped" : "ok";',
      "a total internal reflection ends as status failed; mtfTraceClassification is what calls it blocked",
    );
    assertSource(
      "src/optics/analysis/mtfRayClassification.ts",
      `if (trace.failureReason === "totalInternalReflection" || (trace.status === "clipped" && !trace.failureReason))
       return "blocked";`,
      "answerLvRays in src/engines/lv/rays.ts takes LensVisualizer's own word for blocked and failed",
    );
    const path = "opticalPath of lv is LensVisualizer's sum from the ray's origin to its hit on the last surface";
    assertSource(tracer, "let opticalPathLengthMm = 0;", path);
    assertSource(
      tracer,
      "if (options.recordOpticalPath) opticalPathLengthMm += hit.opticalPathLength ?? n * hit.segmentLength;",
      path,
    );
    assertSource(
      tracer,
      "terminalDirection: direction,",
      "exitDirection of lv is the direction after the last surface",
    );
    assertSource(tracer, "finalMedium: n,", "opticalPathToImage of lv continues in the index LensVisualizer ends in");
  },
);

test("the MTF still puts the field axis together as the ray sets resolve image-height fractions", { skip }, () => {
  const mtf = "src/optics/analysis/mtf.ts";
  const mirror =
    "lvFieldAngles in src/engines/lv/raySets.ts assembles the field axis and its targets from the same functions, " +
    "with the same arguments";
  assertSource(mtf, "const referenceHeight = mtfChiefHeight(state, options, support, false);", mirror);
  assertSource(
    mtf,
    `: resolveMtfFieldGeometry(state, mtfModeledHalfField(state), mtfChiefHeight(state, options, support), {
         reference: referenceHeight,
         beam: mtfBeamHeight(state, options, support),
       });`,
    mirror,
  );
  assertSource(
    mtf,
    "const targets = resolveMtfFieldTargets(state, geometry, fractions, referenceHeight, !support.conjugate);",
    mirror,
  );
  assertSource(
    mtf,
    `target.fieldAngleDeg === null ? null : prepareMtfFieldLaunch(state, options, support, target.fieldAngleDeg);`,
    mirror,
  );
  assertSource(mtf, "let footprint = findMtfFieldFootprint(state, options, support, launch);", mirror);
  // The footprint, and at a finite conjugate the aim of the chief ray, are found at the first line of the support
  // record: the ray sets hand over one whose lines are the case's.
  assertSource(
    "src/optics/analysis/mtfTracing.ts",
    "const traceOptions = mtfTraceOptions(state, options, support, support.spectralLines[0]);",
    "lvLaunchSetup in src/engines/lv/raySets.ts puts the lines of the case into the support record",
  );
  // The tab's own seed of the footprint scan is the wide-open pupil scaled by the f-number; the ray sets take the
  // entrance pupil of the case's stop radius, which is the same number to rounding.
  const hook = "src/components/hooks/useLensComputation.ts";
  const seed = "lvLaunchSetup seeds the footprint with entrancePupilAtState2(stop radius of the case, ...).epSD";
  assertSource(hook, "const currentEPSD = L ? (baseEPSD * currentFOPEN) / fNumber : 0;", seed);
  assertSource(
    "src/optics/field/chiefRay.ts",
    "const epSD = Math.abs(geom.yRatio) > 1e-9 ? Math.abs(stopSD / geom.yRatio) : 0;",
    seed,
  );
});
