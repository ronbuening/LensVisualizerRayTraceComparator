// Source canaries reread at LV ab0fd4cf (closure 94778d3d, 175 files; same closure as 643ef5d0). The canaries of
// the slider's range and of the finite-conjugate addresses were added at Stage 4.4 (ab0fd4cf, closure 7b756ee6,
// 177 files: the binding now imports src/optics/publishedStations.ts). Those LensVisualizer #925 (5ba17c20c) moved,
// of the support gate, the anchored indices, the chief-ray solve, the lateral colour and the vignetting tab, were
// reread at Stage 6.6b, at LV 098c91ef6 (closure fef2e248, 178 files). Those LensVisualizer's PRs #927 to #936 moved
// (the stop rule, the MTF's stop lattice, the aimed pupil samples of the spot, axial and curvature sets, the colour
// zone of four channels, the vignetting tab's stop lattice) were reread at Stage 6.8b, at LV 607ff23ae (closure
// f016b35b, 184 files). Those LensVisualizer #940 moved (a finite object's chief seed, the end of a lattice that aims
// nothing) were reread at LV 6287f4393 (closure fc5ae923, 184 files).
// LensVisualizer exports none of these rules as a function, so the comparator restates them; when LV rewrites
// one, the canary fails and names what to read again. Whitespace is not compared.
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

test("the hook still sizes every stop by LensVisualizer's one stop rule at the slider's f-number", { skip }, () => {
  // Read at 607ff23ae (LV #933): one rule at every f-number, paraxial EPD = F/N at infinity focus of the zoom position.
  const hook = "src/components/hooks/useLensComputation.ts";
  const mirror =
    "stopRadius in src/engines/lv/exportAperture.ts and lvHookStop in tabRequest.ts call the same function";
  assertSource(hook, "const currentFOPEN = L ? fopenAtZoom(zoomT, L) : 1;", mirror);
  assertSource(hook, "const wideOpenStopSD = L ? wideOpenStopAtZoom(zoomT, L) : 0;", mirror);
  assertSource(hook, "const currentPhysStopSD = L ? stopSemiDiameterForFNumber(fNumber, zoomT, L) : 0;", mirror);
  assertSource(
    hook,
    'import { stopSemiDiameterForFNumber, wideOpenStopAtZoom } from "../../optics/optics.js";',
    "the binding takes stopSemiDiameterForFNumber and wideOpenStopAtZoom from the optics barrel, as the hook does",
  );
  // The hook's fopenAtZoom is the function the binding imports as fopenAtZoomClamped, and its f-number never goes below it.
  assertSource(
    hook,
    "fopenAtZoomClamped as fopenAtZoom,",
    "the binding takes fopenAtZoomClamped for the hook's fopenAtZoom",
  );
  assertSource(
    "src/optics/state/aperture.ts",
    "return Math.max(requested, fopenAtZoomClamped(zoomT, L));",
    "stopRadius reports an f-number below the widest as a problem, where the hook clamps it",
  );
  // The rule, which the comparator does not restate but calls: the wide-open stop up to the position's wide-open
  // f-number, the rule's radius above it, never wider; and the rule's radius, which lvNominalFNumber takes back.
  const rule = "src/optics/state/apertureStop.ts";
  assertSource(
    rule,
    `const wideOpen = wideOpenStop(lens, zoomT);
     if (!(fNumber > wideOpenFNumber(lens.constants, zoomT))) return wideOpen;
     return Math.min(wideOpen, fNumberRuleStop(lens, fNumber, zoomT));`,
    "CLAUDE.md and exportAperture.ts describe the stop of an f-number run so",
  );
  assertSource(
    rule,
    `const { referenceFocalLengthMm, stopHeightRatio } = stopRuleGeometry(lens, zoomT);
     return Math.abs((referenceFocalLengthMm / (2 * fNumber)) * stopHeightRatio);`,
    "lvNominalFNumber in src/engines/lv/summary.ts takes the f-number back from a radius by this rule",
  );
  assertSource(
    "src/optics/optics.ts",
    'fNumberRuleStopSemiDiameter, stopSemiDiameterForFNumber, stopRuleGeometry, wideOpenStopAtZoom, } from "./state/apertureStop.js";',
    "LV_IMPORT_MANIFEST takes the three from the optics barrel",
  );
});

test("the aperture slider still ends at maxFstop, which the exporter takes for the largest f-number", { skip }, () => {
  assertSource(
    "src/optics/state/aperture.ts",
    "const requested = L.FOPEN * Math.pow(L.maxFstop / L.FOPEN, stopdownT);",
    "stopRadius in src/engines/lv/exportAperture.ts reports an f-number above maxFstop as aperture-beyond-slider-range",
  );
});

test(
  "a finite conjugate is still addressed by keyframe and zoom station as the station selector resolves it",
  { skip },
  () => {
    const file = "src/optics/analysis/mtf/mtfConjugates.ts";
    const mirror =
      "expandLvStations in src/engines/lv/stations.ts (and documentedConjugates in test/integration/lv/support.ts) " +
      "turn each declared conjugate into the focus and zoom positions LensVisualizer's gate matches";
    assertSource(file, "const count = source.zoom?.stations.length ?? 1;", mirror);
    assertSource(file, "focusT: source.focus.keyframes[conjugate.keyframe],", mirror);
    assertSource(file, "zoomT: count > 1 ? conjugate.zoomStation / (count - 1) : 0,", mirror);
  },
);

test("the support gate still rejects a path for the causes the exporter names, and for no other", { skip }, () => {
  const gate = "src/optics/analysis/mtf/mtfSupport.ts";
  const mirror =
    "structuralProblems in src/engines/lv/exportCase.ts names each cause, and pathIsExpressible in exportLines.ts " +
    "takes a fisheye projection and an annular aperture for the only ones a case can still be exported with";
  // Since 5ba17c20c the two rules are functions of their own, which the vignetting tab asks too (lvVignettingSetup in
  // src/engines/lv/vignettingFields.ts asks them through the binding); the gate rejects a path by them, as before.
  assertSource(
    gate,
    `export function mtfSequentialRefractivePath(state: PreparedGeometry): boolean {
       const { lens } = state;
       return !(
         lens.flags.isFoldedOptics ||
         lens.source.projection?.kind?.startsWith("fisheye") ||
         state.surfaces.some((s) => s.diffractive || (s.innerSd ?? 0) > 0 || s.interaction.type !== "refract")
       );
     }`,
    mirror,
  );
  assertSource(
    gate,
    `export function mtfAxialImagePlane(state: PreparedGeometry): boolean {
       const [x, y, z] = state.imagePlane.normal;
       return !(Math.abs(x) > 1e-10 || Math.abs(y) > 1e-10 || z <= 0);
     }`,
    mirror,
  );
  assertSource(
    gate,
    'if (!mtfSequentialRefractivePath(state)) return reject("unsupported-path", "MTF currently supports centered, sequential refractive prescriptions.");',
    mirror,
  );
  assertSource(
    gate,
    'if (!mtfAxialImagePlane(state)) return reject("unsupported-path", "MTF requires an image plane perpendicular to the optical axis.");',
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
    assertSource(
      "src/optics/analysis/mtf/mtfTracing.ts",
      "if (!support.useResolvedReference) return undefined;",
      mirror,
    );
    assertSource(
      "src/optics/trace/aperture.ts",
      "if (surface.physicalIndex === geometry.stopSurfaceIndex && stopSemiDiameter !== undefined) return stopSemiDiameter;",
      "surfaceAperture in src/engines/lv/exportAperture.ts hands the run's stop radius to evaluateAperture for the stop surface",
    );
  },
);

test("a rim LensVisualizer generated for a rear plate is still the one thing it does not clip by", { skip }, () => {
  const mirror =
    "surfaceAperture in src/engines/lv/exportAperture.ts exports a surface marked `clips: false`, for which " +
    "evaluateAperture reports no semi-diameter, as one without a clip radius, and every other surface with one";
  const aperture = "src/optics/trace/aperture.ts";
  assertSource(aperture, 'if (typeof surface.sd !== "number" || !surface.clips) return null;', mirror);
  assertSource(
    aperture,
    'if (semiDiameter !== null && exceedsAperture(radius, semiDiameter)) { apertureState = "outside"; }',
    mirror,
  );
  // Which surfaces are marked: the two of a plate without a published `sd`, and no surface of an authored lens.
  assertSource(
    "src/optics/prescription/rearPlates.ts",
    "plate.sd === undefined ? { sd: generatedSd, clips: false as const } : { sd: plate.sd };",
    mirror,
  );
  assertSource("src/optics/prescription/surfaces.ts", "clips: surface.clips !== false,", mirror);
  assertSource("src/optics/prescription/validate/schema.ts", "if (s.clips !== undefined) {", mirror);
  assertSource(
    "src/optics/types.ts",
    "clips: boolean;",
    "LvSurface in src/engines/lv/types.ts reads the member, and takes a surface without it for one that clips",
  );
});

test("a flat surface is still one whose radius exceeds 1e10 and that has no asphere", { skip }, () => {
  const mirror =
    "surfaceShape in src/engines/lv/exportShape.ts (LV_FLAT_RADIUS) decides plane, conic and asphere by it";
  assertSource("src/optics/geometry/surfaceProfile.ts", "export const FLAT_R_THRESHOLD = 1e10;", mirror);
  assertSource(
    "src/optics/geometry/surfaceProfile.ts",
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
      "src/optics/geometry/intersect.ts",
      "if (domainRadius !== null && radius > domainRadius) { return { t, point, radius, sag: NaN, slope: NaN, value: NaN, derivative: NaN }; }",
      mirror,
    );
    assertSource("src/optics/geometry/intersect.ts", "const domainRadius = profile.finiteRadiusLimit();", mirror);
    // The clamp that keeps the sag finite out there, and the conic and curvature the sag is evaluated with.
    assertSource(
      "src/optics/geometry/surfaceProfile.ts",
      "const conic = (c * h2) / (1 + conicRoot(c, K, h2));",
      mirror,
    );
    assertSource("src/optics/geometry/surfaceProfile.ts", "const CONIC_ROOT_FLOOR = 1e-12;", mirror);
    assertSource("src/optics/geometry/surfaceProfile.ts", "return Math.sqrt(d > 0 ? d : CONIC_ROOT_FLOOR);", mirror);
    const shape = "describeLvSystem in src/engines/lv/describe.ts reads the curvature and the conic constant this way";
    assertSource(
      "src/optics/geometry/surfaceProfile.ts",
      "return Math.abs(R) > FLAT_R_THRESHOLD ? 0 : 1.0 / R;",
      shape,
    );
    assertSource(
      "src/optics/geometry/surfaceProfile.ts",
      "return conicPolySagAt(h, baseCurvature(R), asph ? asph.K : 0, asph ? hornerTerms(asph) : null);",
      shape,
    );
    assertSource(
      "src/optics/geometry/surfaceProfile.ts",
      "const TERM_SLOTS: readonly TermSlot[] = ASPHERIC_POLYNOMIAL_TERMS.map((term) => {",
      "termsOf in src/engines/lv/describe.ts takes its terms from the same schema",
    );
    assertSource(
      "src/optics/geometry/surfaceProfile.ts",
      "for (const term of TERM_SLOTS) { const coefficient = coefficientOf(asph, term.key); (term.even ? evenSag : oddSag)[term.sagSlot] = coefficient;",
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
      "const marginal = traceParaxialSurfaces(state.surfaces, 1, 0, { skipLastTransfer: true });",
      mirror,
    );
    assertSource(
      matrix,
      "const chief = traceParaxialSurfaces(state.surfaces, 0, 1, { skipLastTransfer: true });",
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
      "rearLensVertexZ: state.z[state.lens.lastLensSurfaceIndex ?? state.surfaces.length - 1],",
      mirror,
    );
    const pupils = "src/optics/first-order/pupils.ts";
    assertSource(
      pupils,
      "const marginal = traceParaxialSurfaces(state.surfaces, 1, 0, { stopAt: stopIndex });",
      mirror,
    );
    assertSource(pupils, "const chief = traceParaxialSurfaces(state.surfaces, 0, 1, { stopAt: stopIndex });", mirror);
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
      "src/components/diagram/DiagramOverlayLayer.tsx",
      "epAtZoomClamped as epAtZoom,",
      "the binding takes epAtZoomClamped for the overlay's epAtZoom",
    );
    // They are found at infinity focus, with real rays and a nominal entrance pupil: recorded, never compared.
    const runtime = "src/optics/first-order/lensConstants.ts";
    const recorded = "answerLvFirstOrder records them only at infinity focus and at a line of authored indices";
    assertSource(runtime, "const epZRelStop = Math.abs(realYRatio) > 1e-9 ? realB / realYRatio - zStop : 0;", recorded);
    assertSource(runtime, "const xpZRelLastSurf = Math.abs(xpU) > 1e-9 ? -xpY / xpU : Infinity;", recorded);
  },
);

test(
  "the MTF bundle still launches a cell where the ray sets launch it, and still weighs it the same way",
  { skip },
  () => {
    const tracing = "src/optics/analysis/mtf/mtfTracing.ts";
    const mirror =
      "lvFieldRays in src/engines/lv/raySets.ts lays the rays of a set on these lattice points, with this launch " +
      "weight, and puts the chief ray after them";
    assertSource(
      tracing,
      `const traceOptions = mtfTraceOptions(state, options, support, line, extras.opticalPath);
       const traceRay = prepareEngineTrace(state, traceOptions);`,
      mirror,
    );
    assertSource(tracing, "const chiefRay = mtfLaunchRay(launch, 0, 0);", mirror);
    assertSource(
      tracing,
      `const x = grid.x0 + (column + 0.5) * grid.step;
     const y = grid.y0 + (row + 0.5) * grid.step;
     const trace = traceRay(mtfLaunchRay(launch, x, y));`,
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
    const tracing = "src/optics/analysis/mtf/mtfTracing.ts";
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
     weight: bulkTransmissionForTrace(state.lens, trace.hits),`,
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
      `capture.hit(i, hit, direction, hitClipped, clipReason);
     if (hitClipped && stopOnClip && !ghost) break;`,
      mirror,
    );
    assertSource(
      tracer,
      `failureReason = interaction.failure.failureReason;
     capture.clip(i, interaction.failure.clipReason, failureReason);
     capture.failure(failureReason, interaction.failure.clipReason);`,
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
      "a total internal reflection ends as status failed; traceRayClassification is what calls it blocked",
    );
    // Since #927 the classification lives in trace/rayClassification.ts, as traceRayClassification.
    const classification = "src/optics/trace/rayClassification.ts";
    assertSource(
      classification,
      `if (trace.failureReason === "totalInternalReflection" || (trace.status === "clipped" && !trace.failureReason))
       return "blocked";`,
      "answerLvRays in src/engines/lv/rays.ts takes LensVisualizer's own word for blocked and failed",
    );
    // Since #934 a surface behind the last hit is met by a step backwards, as in ref and the contract: the hit is
    // recorded in sequence like any other, so the hits before the first clipped one are still the surfaces passed.
    const back = "rays.ts reads a backward hit as any hit; CLAUDE.md says LensVisualizer now steps back as ref does";
    assertSource(
      tracer,
      "const hit = intersectSequentialSurface(geometry, i, origin, direction, { minT, maxT, refractiveIndex: n });",
      back,
    );
    const planner = "src/optics/trace/pathPlanner.ts";
    assertSource(
      planner,
      'if (surfaceIndex === 0 || !(direction[2] > 1e-12) || geometry.traversal.kind !== "sequential") return 0;',
      back + ": no step back to the first surface, for a ray that no longer travels toward +z, or on a folded path",
    );
    assertSource(
      planner,
      `const forward = intersectStateSurface({ origin, direction }, geometry, surfaceIndex, options);
       if (forward.ok || forward.failureReason !== "noBracket") return forward;`,
      back + ": forward first, so a ray that passed before traces bit for bit",
    );
    assertSource(
      planner,
      `return {
       ...hit,
       t: -hit.t,
       segmentLength: -hit.segmentLength,
       opticalPathLength: hit.opticalPathLength === null ? null : -hit.opticalPathLength,
     };`,
      "opticalPath of lv counts a stretch that runs backwards with its sign, as the contract and ref do",
    );
    assertSource(
      classification,
      "const wholeLine = sequentialSurfaceBackT(state.traceGeometry, surfaceIndex, origin, direction) > 0;",
      "a ray LensVisualizer calls blocked by a proven miss misses the surface along its whole line where it may step back",
    );
    assertSource(
      "src/optics/trace/capture.ts",
      `failure(failureReason, clipReason) {
        const hit = hits[hits.length - 1];
        hit.clipped = true;
        hit.failureReason = failureReason;`,
      mirror,
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
  const mtf = "src/optics/analysis/mtf/mtf.ts";
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
    "src/optics/analysis/mtf/mtfTracing.ts",
    'const traceOptions = { ...mtfTraceOptions(state, options, support, support.spectralLines[0]), capture: "terminal", } as const;',
    "lvLaunchSetup in src/engines/lv/raySets.ts puts the lines of the case into the support record",
  );
  // The pupil radius of the request scales the aimed launch's Jacobian probes, and seeds a launch-plane footprint
  // scan; the ray sets take it from the hook's rule (the canary of the hook is below). Read at 607ff23ae.
  assertSource(
    "src/optics/analysis/mtf/mtfTracing.ts",
    `(x, y) => traceRayClassification(traceRay(mtfLaunchRay(launch, x, y)), state, options.stopSemiDiameterMm),
     options.pupilSemiDiameterMm,
     mtfMirrorSymmetric(state),
     growths,
   );`,
    "lvLaunchSetup in src/engines/lv/raySets.ts seeds the footprint scan with lvPupilSeed, as pupilSemiDiameterMm",
  );
  assertSource(
    "src/optics/analysis/mtf/mtfTracing.ts",
    `return prepareAimedStopLatticeForState(
       state,
       { stopSemiDiameterMm: options.stopSemiDiameterMm, launchScaleMm: options.pupilSemiDiameterMm },
       gridSize,
       launch.aim,
       mtfAimSpectrum(state, support, line),
       coarse,
     );`,
    "lvFieldRays aims each line's lattice with lvPupilSeed as the launch scale, through aimMtfStopLattice",
  );
  // A field the aimed launch reaches is sampled on the stop; one launched from the bounding sphere on the launch plane.
  assertSource(
    mtf,
    `if (launch.aim) {
       const sampling: MtfFieldSampling = { kind: "stop", lattices: new Map() };`,
    "lvFieldRays takes the stop lattice where launch.aim is set, and the launch-plane lattice where it is null",
  );
});

// ── The MTF tab's request ────────────────────────────────────────────────────────────────────────────────────────
//
// What LensVisualizer presents as a lens's MTF is what its MTF tab asks its engine for. The tab and the hook that
// feeds it are React code, which cannot be imported: src/engines/lv/tabRequest.ts restates them, and the lines
// below are the ones it restates, pinned at LV commit ed78cf40.

test("the hook still hands the MTF tab the stop and the pupil radius by the expressions lv restates", { skip }, () => {
  // Read at 607ff23ae (LV #933): both radii follow the stop rule and the state's paraxial entrance pupil.
  const hook = "src/components/hooks/useLensComputation.ts";
  const mirror = "lvHookAperture in src/engines/lv/tabRequest.ts restates it, in this order of operations";
  assertSource(hook, "const currentFOPEN = L ? fopenAtZoom(zoomT, L) : 1;", mirror);
  assertSource(hook, "const fNumber = L ? fNumberAtStopdown(stopdownT, zoomT, L) : 1;", mirror);
  assertSource(hook, "const wideOpenStopSD = L ? wideOpenStopAtZoom(zoomT, L) : 0;", mirror);
  assertSource(hook, "const currentPhysStopSD = L ? stopSemiDiameterForFNumber(fNumber, zoomT, L) : 0;", mirror);
  assertSource(
    hook,
    `const baseEPSD =
       L && fieldGeometry ? entrancePupilAtState(wideOpenStopSD, focusT, zoomT, L, fieldGeometry, aberrationT).epSD : 0;`,
    mirror,
  );
  assertSource(
    hook,
    `const currentEPSD =
       L && fieldGeometry ? entrancePupilAtState(currentPhysStopSD, focusT, zoomT, L, fieldGeometry, aberrationT).epSD : 0;`,
    mirror + "; lvHookPupil asks the same of any stop radius",
  );
  assertSource(
    hook,
    `const fieldGeometry = useMemo(
       () => (L ? computeAnalysisFieldGeometryAtState(focusT, zoomT, L, aberrationT) : null),`,
    "lvHookAperture hands entrancePupilAtState the analysis field geometry, as the hook does",
  );
  // A lens opens with its aperture slider at 0 and its aberration control neutral.
  assertSource(
    hook,
    "aberrationT: requestedAberrationT = 0,",
    "lvHookAperture takes the aberration control as neutral",
  );
  assertSource(
    "src/optics/state/aperture.ts",
    "const requested = L.FOPEN * Math.pow(L.maxFstop / L.FOPEN, stopdownT);",
    "lvHookAperture asks fNumberAtStopdown at the slider position 0, which is wide open",
  );
  // The hook's functions are the rewritten exports the binding imports.
  const imported = "the binding takes the same function the hook calls";
  assertSource(hook, "fopenAtZoomClamped as fopenAtZoom,", imported);
  assertSource(
    hook,
    'import { computeAnalysisFieldGeometryAtState, entrancePupilAtState } from "../../optics/fieldGeometry.js";',
    imported,
  );
  // The pupil follows the stop radius through the paraxial marginal ray's height ratio at the stop alone.
  const geometry = "src/optics/field/geometry.ts";
  const pupil = "lvHookPupil takes the pupil of a stop radius as the state's paraxial image of it";
  assertSource(
    geometry,
    `const pupilRatio = state.lens.flags.isFoldedOptics
       ? geom.yRatio
       : traceParaxialSurfaces(state.surfaces, 1, 0, { stopAt: state.lens.stop.surfaceIndex }).y;
     const epSD = Math.abs(pupilRatio) > 1e-9 ? Math.abs(stopSD / pupilRatio) : 0;`,
    pupil,
  );
});

test(
  "the MTF tab still builds its request from its preferences and the hook's radii as lv restates it",
  { skip },
  () => {
    const tab = "src/components/display/analysis/MtfTab.tsx";
    const mirror = "lvTabRequest in src/engines/lv/tabRequest.ts restates it, member for member";
    assertSource(
      tab,
      `const spectrum = useMemo(
       () => resolveMtfSpectrum(preparedState, preferences.spectrum),`,
      mirror,
    );
    // The whole of the options: a member added here, a frequency list for one, is a member lv does not send.
    assertSource(
      tab,
      `const options: MtfRequestOptions = useMemo(
       () => ({
         method: preferences.method,
         spectrum: spectrum.spectrum,
         focus: preferences.focus,
         maxGridSize: preferences.maxGridSize,
         fieldFractions: mtfFieldFractions(preferences.fieldStepPercent),
         movementActive,
       }),`,
      mirror,
    );
    assertSource(tab, "movementActive = false,", "lvTabRequest sends movementActive false: a lens opens unmoved");
    assertSource(
      tab,
      `export function mtfFieldFractions(stepPercent: number): number[] {
       const count = Math.round(100 / stepPercent);
       return Array.from({ length: count + 1 }, (_, i) => i / count);
     }`,
      "lvTabFieldFractions in src/engines/lv/tabRequest.ts restates it",
    );
    // The request goes to the worker as it is, with the state's own positions, and the tab draws a selection of the
    // frequencies it gets back.
    assertSource(
      tab,
      `createAnalysisRequest({ preparedState, dynamicEFL: focalLengthMm ?? 0, currentEPSD, currentPhysStopSD, }),`,
      mirror,
    );
    assertSource(tab, "const job = support.available ? request : null;", mirror);
    assertSource(tab, "const { result, stale, running, error } = useMtfComputation(L, job, options);", mirror);
    assert.equal(occurrences(tab, "frequenciesPerMm"), 0, `${tab} now names the frequencies of its request`);
    assert.equal(occurrences(tab, "frequencies={preferences.frequencies}"), 2, `${tab} draws other frequencies`);
  },
);

test(
  "the tab's f/8 comparison still takes the stop rule's f/8 stop and scales the pupil by the stops, for a lens that is faster and reaches f/8",
  { skip },
  () => {
    // Read at 607ff23ae (LV #933). The run aperture lv-f8-comparison is this stop, and its pupil this one.
    const tab = "src/components/display/analysis/MtfTab.tsx";
    const mirror =
      'lvTabComparison and lvTabRequest in src/engines/lv/tabRequest.ts restate it for the view "f8-comparison"';
    assertSource(tab, "const COMPARISON_F_NUMBER = 8;", "LV_TAB_COMPARISON_F_NUMBER in tabRequest.ts is this number");
    assertSource(
      tab,
      "const compareF8Available = !!fNumber && fNumber < COMPARISON_F_NUMBER - 0.05 && L.maxFstop >= COMPARISON_F_NUMBER;",
      mirror,
    );
    assertSource(
      tab,
      "if (!job || !compareF8Available || !preferences.compareF8 || !(job.aperture.stopSemiDiameterMm > 0)) return null;",
      mirror + ": the hook's wide-open stop is above 0 on every lens LensVisualizer builds",
    );
    assertSource(
      tab,
      `const stop = stopSemiDiameterForFNumber(COMPARISON_F_NUMBER, job.preparedGeometry.zoomT, L);
       // At one state the paraxial entrance pupil is proportional to the stop.
       const pupil = (job.aperture.entrancePupilSemiDiameterMm * stop) / job.aperture.stopSemiDiameterMm;
       return createAnalysisRequest({
         preparedState: job.preparedGeometry,
         dynamicEFL: job.dynamicEFL,
         currentEPSD: pupil,
         currentPhysStopSD: stop,
         perspectiveTraceContext: job.perspectiveTraceContext,
       });`,
      mirror + "; stopRadius in exportAperture.ts makes the stop of lv-f8-comparison, and lvPupilSeed its pupil",
    );
    // The stop is the slider's f/8 stop to the bit: the same function, asked for the same f-number and position.
    assertSource(
      "src/components/hooks/useLensComputation.ts",
      "const currentPhysStopSD = L ? stopSemiDiameterForFNumber(fNumber, zoomT, L) : 0;",
      "CLAUDE.md says lv-f8-comparison and f-number 8 now give the same stop radius",
    );
  },
);

test("the tab's defaults are still the ones the profile lv-tab-default is documented and pinned with", { skip }, () => {
  // The profile reads LensVisualizer's defaults when it runs, so a change here changes no code of the comparator:
  // it changes what the profile is. README.md, contract/CONTRACT.md and the figures pinned in
  // test/integration/lv/mtf.test.ts describe these. Read at 607ff23ae: since #936 256 cells across the stop.
  assertSource(
    "src/utils/state/mtfPreferences.ts",
    `export const DEFAULT_MTF_PREFERENCES: MtfPreferences = Object.freeze({
       method: "diffraction",
       spectrum: "photopic",
       focus: "best-axial",
       view: "field",
       fieldStepPercent: 10,
       frequencies: Object.freeze([10, 30] as const),
       maxGridSize: 256,
       compareF8: false,
     });`,
    "the profile lv-tab-default follows it at run time; its documented defaults and pinned figures are of these",
  );
  assertSource(
    "src/optics/analysis/mtf/mtfConstants.ts",
    "export const MTF_FREQUENCIES: readonly number[] = Object.freeze(Array.from({ length: 51 }, (_, i) => i * 2));",
    "the frequencies of the profile are documented as 0 to 100 cycles/mm in steps of 2",
  );
});

test("the grid caps, the names and the limits of a request are still as lv states, maps or asks them", { skip }, () => {
  const constants = "src/optics/analysis/mtf/mtfConstants.ts";
  assertSource(
    constants,
    "export const MTF_GRID_CAPS: readonly MtfGridCap[] = Object.freeze([32, 64, 128, 256]);",
    "LV_GRID_CAPS in src/engines/lv/mtf.ts is this list: a cap of the option lvGridCap is held to it",
  );
  // The default cap is not restated: lvMtfRequest reads MTF_DEFAULT_GRID_CAP through the binding (256 at 607ff23ae).
  assertSource(
    constants,
    "export const MTF_DEFAULT_GRID_CAP: MtfGridCap = 256;",
    "lvMtfRequest in src/engines/lv/mtf.ts takes this cap for a request without a profile or an lvGridCap",
  );
  // The names lv maps to the contract's, and the ones it passes on, are still all there are.
  const types = "src/types/mtf.ts";
  assertSource(
    types,
    'export type MtfMethod = "geometric" | "diffraction";',
    "the methods of an mtf.native spec are LensVisualizer's by the same names (answerLvMtf, lvTabSpec)",
  );
  assertSource(
    types,
    'export type MtfSpectrum = "reference" | "cdf" | "photopic";',
    "LV_MTF_SPECTRA in src/engines/lv/mtf.ts is this list: the lines of a case are held to each (lvSpectrumOf)",
  );
  assertSource(
    types,
    'export type MtfFocusMode = "auto" | "design" | "best-axial";',
    'answerLvMtf asks "design" for the design plane and "best-axial" for engine-best; lvTabSpec maps them back',
  );
  assertSource(
    types,
    'export type MtfFieldStatus = "converged" | "unconverged" | "unavailable" | "pending";',
    'fieldOf in src/engines/lv/mtf.ts maps "converged" to ok, passes two on and refuses "pending"',
  );
  // What the MTF states of a field's sampling and of the axial beam, which fieldOf and mtfData write down.
  assertSource(types, 'pupilSampling: "stop" | "launch-plane";', "fieldOf records the counts beside it");
  assertSource(types, "unaimedRays: number;", "fieldOf records sampling.unaimedRays");
  assertSource(types, "unresolvedInBeamRays: number;", "fieldOf records sampling.unresolvedInBeamRays");
  assertSource(
    types,
    "axialVignetting: MtfAxialVignetting | null;",
    "mtfData records axialVignettingSurfaceIndex and axialVignettingBeforeStop under aperture",
  );
  // The limits on the fields and frequencies of one request are not restated: lv asks the gate, which must still
  // answer for them with the reason lv reads as a refusal of what was added to a request it had passed.
  const gate = "src/optics/analysis/mtf/mtfSupport.ts";
  const asked = "specRefusal in src/engines/lv/mtf.ts asks the gate with the spec's fields, then its frequencies";
  assertSource(gate, "fields.length > MTF_MAX_FIELDS ||", asked);
  assertSource(gate, "frequencies.length > MTF_MAX_FREQUENCIES ||", asked);
  assertSource(gate, "frequencies.some((f) => !Number.isFinite(f) || f < 0 || f > MTF_MAX_FREQUENCY_LPMM) ||", asked);
  assertSource(
    gate,
    'return reject("invalid-input", "MTF requires finite physical apertures, fields and image-space frequencies.");',
    asked,
  );
});

test(
  "the tab's worker still computes a request as computeMtf does: on a state of its own, by the same steps",
  { skip },
  () => {
    const worker = "src/components/hooks/mtf.worker.ts";
    const mirror = "answerLvMtf in src/engines/lv/mtf.ts calls computeMtf on the state it prepared for the case";
    assertSource(worker, "const { focusT, zoomT, aberrationT, options } = message.job;", mirror);
    assertSource(worker, "const state = prepareRuntimeState(lens, focusT, zoomT, aberrationT);", mirror);
    assertSource(
      worker,
      `steps: computeMtfSteps( createAnalysisRequest({ preparedState: state, dynamicEFL: 0,
      currentEPSD: options.pupilSemiDiameterMm, currentPhysStopSD: options.stopSemiDiameterMm,
    }), options, jobCache(message.job), ),`,
      mirror,
    );
    // The worker rebuilds the canonical prescription held by the runtime, without duplicating generated surfaces.
    assertSource(
      worker,
      "lens = buildCanonicalLens(message.input);",
      "lv builds the catalog prescription; the worker builds its canonical form",
    );
    assertSource(
      "src/components/hooks/mtfWorkerClient.ts",
      'this.worker.postMessage({ type: "init", input: canonicalLensFromRuntime(this.lens) });',
      "the worker receives the runtime's canonical prescription",
    );
    const engine = "src/optics/analysis/mtf/mtf.ts";
    assertSource(
      engine,
      `export function computeMtf(request: AnalysisRequest, options: MtfRequestOptions): MtfResult {
       const steps = computeMtfSteps(request, options);
       let next = steps.next();
       while (!next.done) next = steps.next();
       return next.value;
     }`,
      mirror,
    );
    assertSource(
      engine,
      "const frequencies = [...(options.frequenciesPerMm ?? MTF_FREQUENCIES)];",
      "lvTabRequest names no frequencies and takes LensVisualizer's MTF_FREQUENCIES for what comes back",
    );
    // The request crosses to the worker as JSON, which keeps every double.
    assertSource(
      "src/components/hooks/useMtfComputation.ts",
      ".compute(JSON.parse(key) as MtfJob,",
      "the options lv hands computeMtf are the tab's as numbers, which JSON carries exactly",
    );
  },
);

test(
  "the aspheric schema still starts at A4 and at A3: no lens has a term of power 1 or 2, which no paraxial kernel sees",
  { skip },
  () => {
    // Read at 5278694b. The contract counts twice the coefficient of a term of power 2 as curvature at a vertex and
    // has no first-order data for a term of power 1; LensVisualizer's kernel is handed radii alone.
    const schema = "src/types/asphericSchema.ts";
    const mirror =
      "termItems in src/engines/lv/firstOrder.ts answers paraxial.first-order of a case with a term of power 1 or 2 " +
      "as unsupported, and docs/gotchas.md says that no lens of LensVisualizer has one: decide again what lv says " +
      "of such a lens, and whether LensVisualizer's own first-order module reads the new coefficient";
    assertSource(
      schema,
      `{ key: "K", kind: "conic", power: 0, parity: "even", required: true },
       { key: "A4", kind: "polynomial", power: 4, parity: "even", required: true },`,
      mirror,
    );
    assertSource(
      schema,
      `{ key: "A20", kind: "polynomial", power: 20, parity: "even", required: false },
       { key: "A3", kind: "polynomial", power: 3, parity: "odd", required: false },`,
      mirror,
    );
    for (const power of [1, 2]) assert.equal(occurrences(schema, `power: ${power},`), 0, `power ${power}: ${mirror}`);
    // The kernel's power of a surface is still the step of the index over the radius, and nothing else of a shape.
    assertSource(
      "src/optics/math/paraxial.ts",
      "const refractivePower = Math.abs(surface.R) < FLAT_R_THRESHOLD ? (nextN - n) / surface.R : 0;",
      mirror,
    );
  },
);

test(
  "the geometric OTF still has the sign, the axes, the reference and the weights the comparator's estimator states",
  { skip },
  () => {
    const math = "src/optics/analysis/mtf/mtfMath.ts";
    const mirror =
      "src/estimators/geometricOtf.ts states the same conventions for the comparator's own sum, and shares no line " +
      "with it: minus in the phase, the weights as flux, the sum over the total weight";
    assertSource(math, "const position = point[axis];", mirror);
    assertSource(
      math,
      `const phase = -2 * Math.PI * frequencies[i] * position;
       real[i] += point.weight * Math.cos(phase);
       imaginary[i] += point.weight * Math.sin(phase);`,
      mirror,
    );
    // The same sign in the branch for an evenly spaced list, which the estimator has no counterpart of.
    assertSource(
      math,
      `const start = -2 * Math.PI * frequencies[0] * position;
       const rotation = -2 * Math.PI * step * position;`,
      mirror,
    );
    assertSource(
      math,
      `const total = points.reduce((sum, p) => sum + p.weight, 0);
       if (!(total > 0)) return { real: [], imaginary: [] };`,
      "spotSums answers no-flux where LensVisualizer returns empty lists",
    );
    assertSource(
      math,
      "return { real: Array.from(real, (v) => v / total), imaginary: Array.from(imaginary, (v) => v / total) };",
      mirror,
    );
    assertSource(
      math,
      "return otf.real.map((re, i) => Math.min(1, Math.hypot(re, otf.imaginary[i])));",
      "the estimator's modulus is not cut off at 1, and src/estimators/geometricOtf.ts says so",
    );
    // The lines of a spectrum: complex sums weighted before the magnitude, each by line weight times flux.
    const spectrum =
      "polychromaticOtf in src/estimators/geometricOtf.ts adds the lines up by weight times flux, about one point";
    assertSource(
      math,
      `real: samples[0].otf.real.map((_, i) => samples.reduce((sum, s) => sum + s.weight * s.otf.real[i], 0) / total),`,
      spectrum,
    );
    const mtf = "src/optics/analysis/mtf/mtf.ts";
    assertSource(mtf, "const transmitted = bundle.rays.reduce((sum, ray) => sum + ray.weight, 0);", spectrum);
    assertSource(mtf, "const weight = line.weight * transmitted;", spectrum);
    // One reference for every line, the chief ray's landing at the first: x is the sagittal cut, y the tangential.
    assertSource(mtf, "commonReference ??= bundle.chief;", spectrum);
    assertSource(
      mtf,
      `const reference = commonReference;
       const points = bundle.rays.map((p) => ({ x: p.x - reference.x, y: p.y - reference.y, weight: p.weight }));
       sagittal.push({ otf: geometricOtf(points, context.frequencies, "x"), weight });
       tangential.push({ otf: geometricOtf(points, context.frequencies, "y"), weight });`,
      "geometricOtf takes positions about one reference, the cut along x for sagittal and along y for tangential",
    );
    assertSource(
      mtf,
      `field.sagittal = otfMagnitude(combineOtfs(sagittal));
       field.tangential = otfMagnitude(combineOtfs(tangential));`,
      spectrum,
    );
  },
);

test(
  "LensVisualizer's two wave estimates still differ from the comparator's as docs/gotchas.md says they do",
  { skip },
  () => {
    const wave = "src/optics/analysis/mtf/mtfWavefront.ts";
    const sheared = "src/optics/analysis/mtf/mtfShearedOtf.ts";
    const shared =
      "src/estimators/waveOtf.ts states the same conventions for the comparator's own estimator, and shares no line " +
      "with it: the pupil coordinate, the shear, the path to the foot of the perpendicular and the sign of the phase";
    const differs =
      "docs/gotchas.md, 'LensVisualizer has two wave estimates', says how each differs from src/estimators/waveOtf.ts";
    // What the comparator's estimator shares: optical cosines, a shear of lambda nu, the path, the sign.
    assertSource(wave, "lattice.cosineX[cell] = ray.trace.finalMedium * ray.trace.terminalDirection[0];", shared);
    assertSource(wave, "lattice.cosineY[cell] = ray.trace.finalMedium * ray.trace.terminalDirection[1];", shared);
    assertSource(wave, "const halfShear = (frequency * wavelengthMm) / 2;", shared);
    assertSource(sheared, "const halfShear = (frequency * wavelengthMm) / 2;", shared);
    assertSource(
      wave,
      `const along = (image[0] - p[0]) * d[0] + (image[1] - p[1]) * d[1] + (image[2] - p[2]) * d[2];
       return launchPhaseMm(ray, objectPoint) + ray.opticalPathLengthMm! + ray.finalMedium * along;`,
      shared,
    );
    assertSource(
      wave,
      `return objectPoint
         ? Math.hypot(origin[0] - objectPoint[0], origin[1] - objectPoint[1], origin[2] - objectPoint[2])
         : origin[0] * direction[0] + origin[1] * direction[1] + origin[2] * direction[2];`,
      "launchPaths in src/estimators/waveOtf.ts: the projection of the origin, or the length from the object",
    );
    assertSource(
      wave,
      `const phase = (2 * Math.PI * (plus.pathMm - minus.pathMm)) / wavelengthMm;
       re += pair * Math.cos(phase);
       im += pair * Math.sin(phase);`,
      shared,
    );
    assertSource(wave, "is trustworthy while this stays under a quarter wave.", shared);
    // What it does otherwise: the square root of flux without the area, pairs centred on a cell, lines of the
    // lattice for lines of constant cosine, and in the product path landing errors for the path.
    assertSource(wave, "lattice.amplitude[cell] = Math.sqrt(ray.weight);", differs);
    assertSource(sheared, "amplitude[line * stride + cell] = Math.sqrt(ray.weight);", differs);
    assertSource(
      wave,
      `const plus = waveAt(line, line.cosine[slot] + halfShear);
       const minus = waveAt(line, line.cosine[slot] - halfShear);
       const pair = plus.amplitude * minus.amplitude;`,
      differs,
    );
    assertSource(wave, 'axis === "x" ? [rows, columns, columns, 1] : [columns, rows, 1, columns];', differs);
    assertSource(sheared, "const scale = -frequency * TURN;", differs);
    assertSource(sheared, "const TURN = 4096;", differs);
    assertSource(sheared, ": (errorMinus + 4 * errorCentre + errorPlus) / 6;", differs);
    assertSource(sheared, "12 * errorCentre) / 90", differs);
    assertSource(
      sheared,
      "const half = bundle.mirrored && bundle.columns === columns && columns % 2 === 0 ? columns / 2 : 0;",
      differs,
    );
  },
);

test(
  "the MTF still sets a request up, walks a field and widens its footprint as the replay restates them",
  { skip },
  () => {
    // Read at 33ebdb30 (engine closure 78215d72); traceField and refineMtfField again at 607ff23ae (LV #936).
    const mtf = "src/optics/analysis/mtf/mtf.ts";
    const job =
      "replayLvMtf in src/engines/lv/replay.ts takes the request from the first step of computeMtfSteps and " +
      "restates what follows it: the ladder, the image plane, and which fields are traced";
    // A request the gate refuses, and one without a field axis, is returned before anything is yielded.
    assertSource(mtf, "if (!support.available) return result;", job);
    assertSource(
      mtf,
      `if (!geometry) {
         result.fields = fractions.map((fraction) =>
           markUnavailable(emptyMtfField(fraction), "chief-ray-failed", "No valid chief ray reaches the image plane."),
         );
         return result;
       }`,
      job,
    );
    assertSource(mtf, "const cap = options.maxGridSize ?? MTF_DEFAULT_GRID_CAP;", job);
    assertSource(mtf, "ladder: MTF_GRID_LADDER.filter((size) => size <= cap),", job);
    // The first step states every field's target, pending or outside the model, and the focus that moves the plane.
    assertSource(
      mtf,
      `result.fields = targets.map((target) =>
         target.outsideModel
           ? markUnavailable(emptyMtfField(target.fraction, target), "outside-modeled-field", outsideModelMessage(geometry))
           : emptyMtfField(target.fraction, target),
       );`,
      job,
    );
    assertSource(
      mtf,
      `context.imagePlaneZ = state.imgZ + result.focus.appliedShiftMm;
       yield result;
       for (const index of mtfFieldProcessingOrder(fractions)) {
         if (targets[index].outsideModel) continue;`,
      job +
        "; exportCase in src/engines/lv/exportCase.ts adds the best axial shift to the design plane in the same way",
    );
    // The focus the first step states: applied for the mode best-axial, and null where there is no axial beam.
    assertSource(
      mtf,
      `if (requestedMode === "best-axial" || (requestedMode === "auto" && focus.imagePlaneInconsistent)) {
         focus.mode = "best-axial";
         focus.appliedShiftMm = best.shiftMm;
       }`,
      "lvBestAxialFocus in src/engines/lv/focus.ts takes a focus whose mode is best-axial for one that was found",
    );
    assertSource(
      mtf,
      "const size = Math.min(MTF_FOCUS_GRID, context.ladder.at(-1) ?? MTF_FOCUS_GRID);",
      "the best axial focus is of one grid cap, which lvBestAxialFocus is handed and CONTRACT.md says",
    );

    const field = "replayField in src/engines/lv/replay.ts restates traceField, line by line (read at 607ff23ae)";
    assertSource(
      mtf,
      `const launch =
         target.fieldAngleDeg === null ? null : prepareMtfFieldLaunch(state, options, support, target.fieldAngleDeg);
       if (!launch) {
         yield markUnavailable(
           emptyMtfField(target.fraction, target),
           "chief-ray-failed",
           "No valid chief ray reaches this image height.",
         );
         return;
       }
       if (launch.aim) {
         const sampling: MtfFieldSampling = { kind: "stop", lattices: new Map() };
         yield* refineMtfField(
           context.ladder,
           (size) => fieldAtGrid(context, target, launch, sampling, size),
           context.frequencies,
         );
         return;
       }
       let footprint = findMtfFieldFootprint(state, options, support, launch);
       if (!footprint) {
         const field = emptyMtfField(target.fraction, target);
         field.pupilSampling = "launch-plane";
         yield markUnavailable(field, "vignetted", "No rays reach this image height through the model's clear apertures.");
         return;
       }
       let expansions = 0;
       const evaluate = (size: number): MtfGridOutcome => {
         for (;;) {
           const outcome = fieldAtGrid(context, target, launch, { kind: "launch-plane", footprint: footprint! }, size);
           const open = outcome.kind === "curves" ? outcome.openBorders : undefined;
           if (!open || !(open.x || open.y0 || open.y1)) return outcome;
           if (expansions >= MTF_MAX_FOOTPRINT_EXPANSIONS) {
             outcome.field.notes.push(
               "Transmitted rays reach the edge of the sampled pupil region; some flux may be missing.",
             );
             return outcome;
           }`,
      field,
    );
    assertSource(
      mtf,
      `footprint = expandMtfFootprint(footprint!, open);
           expansions++;
         }
       };
       yield* refineMtfField(context.ladder, evaluate, context.frequencies);`,
      field,
    );
    // The walk through the ladder is LensVisualizer's own function, which the replay calls: it still yields the
    // best field after every size, ends at a converged one, goes on after a failure a finer grid may mend (a share of
    // unresolved samples included, since #936), and says why a coarser curve was kept.
    assertSource(
      mtf,
      `for (const size of ladder) {
         const outcome = evaluate(size);
         if (outcome.kind === "unavailable") {
           failed = { size, message: outcome.field.message };
           if (!outcome.refine) {
             if (previous) explain(previous);
             yield previous ?? outcome.field;
             return;
           }
           yield previous ?? outcome.field;
           continue;
         }
         failed = null;
         applyConvergence(outcome.field, previous, frequencies);
         yield outcome.field;
         if (outcome.field.status === "converged") return;
         previous = outcome.field;
       }
       if (previous && failed) {
         explain(previous);
         yield previous;
       }`,
      "replayField takes the last field refineMtfField yields for the field's result, as computeMtfSteps does",
    );
    assertSource(
      mtf,
      `for (const field of traceField(context, targets[index])) {
         finished = field;
         result.fields[index] = field;`,
      "replayField takes the last field refineMtfField yields for the field's result",
    );
  },
);

test("the MTF still accounts for one field at one grid as the replay restates it", { skip }, () => {
  // Read at 607ff23ae (LV #936: the stop lattice, dark lines, the unresolved samples beside the beam), and at
  // 6287f4393 (LV #940: a lattice that aims nothing ends the field as "aim-failed").
  const mtf = "src/optics/analysis/mtf/mtf.ts";
  const mirror = "fieldAtGrid in src/engines/lv/replay.ts restates the bookkeeping, line by line and in this order";
  assertSource(
    mtf,
    `const field = emptyMtfField(target.fraction, target);
     field.gridSize = size;
     field.pupilSampling = sampling.kind;
     if (sampling.kind === "launch-plane") field.notes.push(MTF_LAUNCH_PLANE_NOTE);
     const unavailable = (reason: MtfUnavailableReason, message: string, refine = false): MtfGridOutcome => ({
       kind: "unavailable",
       field: markUnavailable(field, reason, message),
       refine,
     });
     const openBorders: MtfOpenBorders = { x: false, y0: false, y1: false };`,
    mirror,
  );
  assertSource(
    mtf,
    `const MTF_LAUNCH_PLANE_NOTE =
       "This field launches from the bounding sphere, which the stop lattice does not cover: its pupil is sampled in equal cells of the launch plane, not evenly on the stop.";`,
    "LV_LAUNCH_PLANE_NOTE in src/engines/lv/replay.ts is this note",
  );
  assertSource(
    mtf,
    `let sampledWeight = 0;
     let unresolvedWeight = 0;
     /** Wavelengths no ray reaches at this grid. */
     let darkLines = 0;
     for (const [index, line] of support.spectralLines.entries()) {
       let bundle: MtfBundle | null;
       if (sampling.kind === "stop") {
         bundle = traceMtfStopBundle(state, options, support, launch, size, line, context.imagePlaneZ, {
           reference: commonReference,
           coarse: sampling.lattices.get(index),
         });
         if (bundle?.lattice) sampling.lattices.set(index, bundle.lattice);
       } else {
         bundle = traceMtfLaunchPlaneBundle(
           state,
           options,
           support,
           launch,
           sampling.footprint,
           size,
           line,
           context.imagePlaneZ,
           { reference: commonReference },
         );
       }
       if (!bundle) return unavailable("chief-ray-failed", "No valid chief ray reaches the image plane.");
       chiefClipped ??= bundle.chiefClipped;
       commonReference ??= bundle.chief;
       field.imageHeightMm = Math.hypot(commonReference.x, commonReference.y);
       field.validRays += bundle.rays.length;
       field.blockedRays += bundle.blocked;
       field.failedRays += bundle.failed;
       field.unaimedRays += bundle.unaimed;
       field.unresolvedInBeamRays += bundle.unresolvedInBeam;
       openBorders.x ||= bundle.openBorders.x;
       openBorders.y0 ||= bundle.openBorders.y0;
       openBorders.y1 ||= bundle.openBorders.y1;
       // A finer lattice solves its cells as this one does, so a lattice that aims nothing ends the ladder.
       if (bundle.lattice && aimedNothing(bundle.lattice))
         return unavailable("aim-failed", aimFailedMessage(bundle.lattice, line.wavelengthNm));
       const transmitted = bundle.rays.reduce((sum, ray) => sum + ray.weight, 0);
       sampledWeight += transmitted + bundle.unresolvedInBeamWeight;
       unresolvedWeight += bundle.unresolvedInBeamWeight;
       // A wavelength no ray reaches, with every sample resolved: the grid is vignetted if every wavelength is.
       if (bundle.rays.length === 0 && bundle.unaimed + bundle.failed === 0) {
         darkLines++;
         continue;
       }`,
    mirror,
  );
  // LV #940: which lattice aimed nothing, and the words the field is ended with, restated in replay.ts.
  assertSource(
    mtf,
    `function aimedNothing(lattice: AimedStopLattice): boolean {
       return lattice.aimedCount === 0 && lattice.blockedCount === 0 && lattice.unaimedCount > 0;
     }`,
    "aimedNothing in src/engines/lv/replay.ts is this test",
  );
  assertSource(
    mtf,
    `function aimFailedMessage(lattice: AimedStopLattice, wavelengthNm: number): string {
       const reasons = Object.entries(lattice.unaimedByReason)
         .filter(([, count]) => count > 0)
         .map(([reason, count]) => \`\${count} \${reason}\`)
         .join(", ");
       const chief =
         lattice.chief.status === "unaimed" ? \` The stop-centre chief is unaimed too (\${lattice.chief.reason}).\` : "";
       return \`No sample of the \${lattice.cellsAcross}-cell stop lattice could be aimed at \${wavelengthNm.toFixed(1)} nm (\${reasons}).\${chief}\`;
     }`,
    "aimFailedMessage in src/engines/lv/replay.ts builds this message",
  );
  assertSource(
    "src/types/mtf.ts",
    `| "chief-ray-failed"
     | "aim-failed"
     | "trace-failed"`,
    'replay.ts and the LvMtfFieldResult reason name "aim-failed" among LensVisualizer\'s reasons; fieldOf passes it on',
  );
  assertSource(
    mtf,
    `if (bundle.rays.length < MTF_MIN_RAYS || !(transmitted > 0))
       return unavailable("empty-pupil", "Too little pupil remains to estimate MTF.", true);`,
    mirror,
  );
  assertSource(
    mtf,
    `if (darkLines === support.spectralLines.length)
       return unavailable("vignetted", "No rays reach this image height through the model's clear apertures.", true);
     if (darkLines > 0) return unavailable("empty-pupil", "Too little pupil remains to estimate MTF.", true);
     field.unknownFluxFraction = sampledWeight > 0 ? unresolvedWeight / sampledWeight : 0;
     const unresolvedRays = field.failedRays + field.unaimedRays;
     const unresolved = assessUnresolvedFlux(unresolvedRays, field.unknownFluxFraction, field.unresolvedInBeamRays);
     // A finer grid can resolve a beam edge this one cannot, so the ladder goes on.
     if (!unresolved.acceptable) {
       const away = unresolvedRays - field.unresolvedInBeamRays;
       return unavailable(
         "trace-failed",
         \`\${field.unresolvedInBeamRays} pupil samples beside the transmitted beam could not be aimed or traced and carry \${(field.unknownFluxFraction * 100).toFixed(1)}% of its flux, too much for an MTF estimate.\${away > 0 ? \` \${away} more touch no transmitted cell.\` : ""}\`,
         true,
       );
     }
     if (unresolved.note) field.notes.push(unresolved.note);`,
    mirror,
  );
  assertSource(mtf, 'return { kind: "curves", field, openBorders };', mirror);
  // The reference a later line is handed stands in only where that line's own chief ray has no image point; the
  // bundle states the point it used as its chief, the counts it adds, and on the launch plane which sides of the
  // footprint carried flux.
  const tracing = "src/optics/analysis/mtf/mtfTracing.ts";
  const bundle =
    "the replay reads the reference, the counts, the unresolved weights and the open borders off LensVisualizer's bundles";
  assertSource(
    tracing,
    "const chiefPoint = mtfImagePoint(state, chiefTrace, imagePlaneZ) ?? extras.reference;",
    bundle,
  );
  assertSource(
    tracing,
    "extras: { reference?: MtfSpot; opticalPath?: boolean; coarse?: AimedStopLattice | null } = {},",
    bundle,
  );
  assertSource(
    tracing,
    `const lattice = aimMtfStopLattice(state, options, support, launch, gridSize, line, extras.coarse);
     return lattice && traceMtfLattice(state, options, support, launch, lattice, line, imagePlaneZ, extras);`,
    bundle,
  );
  assertSource(
    tracing,
    `const beside = unresolvedBesideBeam(outcome, unresolvedWeights, n, n);
     bundle.unresolvedInBeam = beside.count;
     bundle.unresolvedInBeamWeight = beside.weight;`,
    bundle,
  );
  assertSource(
    tracing,
    `if (Math.abs(x) > footprint.x1 - footprint.guardMm) bundle.openBorders.x = true;
     if (y < footprint.y0 + footprint.guardMm) bundle.openBorders.y0 = true;
     if (y > footprint.y1 - footprint.guardMm) bundle.openBorders.y1 = true;`,
    bundle,
  );
  // What the replay calls and does not restate: the aimer's block of a total reflection ahead of the stop, its retry
  // of a seeded cell by the lone solve, and its refusal of a size that is no whole number.
  const aimed = "src/optics/analysis/pupils/aimedPupil.ts";
  const called =
    "the replay calls traceMtfStopBundle, which aims through these; test/engines/lv/replay.test.ts says so";
  assertSource(
    aimed,
    `if (!Number.isInteger(cellsAcross) || cellsAcross < 1)
       throw new RangeError(\`A stop lattice needs a positive whole number of cells across, not \${String(cellsAcross)}.\`);`,
    called,
  );
  assertSource(tracing, "@throws RangeError when `gridSize` is not a positive integer", called);
  // The constants the replay is handed are still exported under these names, with the values it was read at.
  const constants = "src/optics/analysis/mtf/mtfConstants.ts";
  const named = "LV_IMPORT_MANIFEST in src/engines/lv/manifest.ts imports the constant by this name";
  assertSource(constants, "export const MTF_GRID_LADDER = Object.freeze([16, 32, 64, 128, 256] as const);", named);
  assertSource(constants, "export const MTF_DEFAULT_GRID_CAP: MtfGridCap = 256;", named);
  assertSource(constants, "export const MTF_MAX_FOOTPRINT_EXPANSIONS = 2;", named);
  assertSource(constants, "export const MTF_MIN_RAYS = 16;", named);
  assertSource(
    constants,
    "export const MTF_FIELDS: readonly number[] = Object.freeze([0, 0.25, 0.5, 0.75, 1]);",
    named,
  );
});

test(
  "the request the tab hands its worker keeps both radii as given, which the f/8 pupil is formed of",
  { skip },
  () => {
    // Read at 607ff23ae: lvTabComparisonPupil reads the wide-open request's radii as the hook's two, unchanged.
    const request = "src/optics/analysis/request.ts";
    const mirror = "lvTabComparisonPupil in src/engines/lv/tabRequest.ts takes job.aperture for the hook's radii";
    assertSource(
      request,
      `aperture: Object.freeze({
       entrancePupilSemiDiameterMm: params.currentEPSD,
       stopSemiDiameterMm: params.currentPhysStopSD,
     }),`,
      mirror,
    );
  },
);

test("the request snapshots both aperture radii, and MTF resolves them with the pose override", { skip }, () => {
  const mirror = "lvMtfInputs and lvResolvedMtfOptions in src/engines/lv/tabRequest.ts";
  assertSource(
    "src/optics/analysis/request.ts",
    "const { preparedState, perspectiveTraceContext = null } = params;",
    mirror,
  );
  assertSource(
    "src/optics/analysis/request.ts",
    "preparedGeometry: preparedState, dynamicEFL: params.dynamicEFL,",
    mirror,
  );
  assertSource("src/optics/analysis/request.ts", "pose: perspectiveTraceContext?.pose ?? null,", mirror);
  assertSource(
    "src/optics/analysis/request.ts",
    `aperture: Object.freeze({
    entrancePupilSemiDiameterMm: params.currentEPSD, stopSemiDiameterMm: params.currentPhysStopSD, }),`,
    mirror,
  );
  assertSource(
    "src/optics/analysis/mtf/mtfSupport.ts",
    `export function resolveMtfOptions(request: AnalysisRequest, options: MtfRequestOptions): MtfOptions {
    return { ...options, pupilSemiDiameterMm: request.aperture.entrancePupilSemiDiameterMm,
    stopSemiDiameterMm: request.aperture.stopSemiDiameterMm, movementActive: request.pose?.active ?? options.movementActive, }; }`,
    mirror,
  );
  assertSource(
    "src/components/hooks/useMtfComputation.ts",
    `request ? {
    focusT: request.preparedGeometry.focusT,
    zoomT: request.preparedGeometry.zoomT,
    aberrationT: request.preparedGeometry.aberrationT,
    options: { ...options,
    pupilSemiDiameterMm: request.aperture.entrancePupilSemiDiameterMm,
    stopSemiDiameterMm: request.aperture.stopSemiDiameterMm, movementActive: request.pose?.active ?? options.movementActive, },
    } : null,`,
    mirror,
  );
  assertSource(
    "src/optics/first-order/lensConstants.ts",
    "return traceSurfacesParaxial(S, y0, u0, opts);",
    "firstOrder calls the optics barrel's paraxialTrace",
  );
  assertSource(
    "src/optics/analysis/mtf/mtf.ts",
    `export function* computeMtfSteps(
    request: AnalysisRequest, settings: MtfRequestOptions, cache?: MtfJobCache,
  ): Generator<MtfResult, MtfResult> {`,
    mirror,
  );
});

test("folded visits still use side filters, transparent holes and a sequential-only OPL capture", { skip }, () => {
  assertSource(
    "src/optics/trace/interactions.ts",
    'return dot(direction, normal) >= 0 ? "front" : "rear";',
    "contract 1.4's incident-side convention",
  );
  assertSource(
    "src/optics/trace/generalizedTrace.ts",
    'return surface.interaction.inactiveSide === "block" && withinAperture ? "inactive-side-block" : null;',
    "inactive-side policy exported verbatim",
  );
  assertSource(
    "src/optics/trace/generalizedTrace.ts",
    'if (surface.interaction.type === "block") return withinAperture ? "block-surface" : null;',
    "closed opaque bands and transparent complements",
  );
  assertSource(
    "src/optics/trace/generalizedTrace.ts",
    "origin = advanceOrigin(point, direction); continue;",
    "LV omits passive/hole hits from its history; the adapter marks those visits unrecorded",
  );
  assertSource(
    "src/optics/trace/generalizedTrace.ts",
    "nextSurfaceIndex = explicitOrder[explicitCursor++];",
    "one declared visit per step of LV's loop: alignFolded's order",
  );
  assertSource(
    "src/optics/trace/generalizedTrace.ts",
    "heights!.push(projectCoordinateToZ(point[1], point[2], direction[1], direction[2], surface.z)); } const side = incidentSideFor(direction, normal);",
    "a height for every visit LV found, before it decides whether the visit is passive: alignFolded places hits by it",
  );
  assertSource(
    "src/optics/trace/generalizedTrace.ts",
    'geometry.pathPlan.mode === "auto" ? undefined : reflectiveSurfaceIndexes,',
    "run confirmation and the request-time backstop: after declared visits LV searches reflective surfaces",
  );
  assertSource(
    "src/optics/trace/generalizedTrace.ts",
    'geometry.surfaces.flatMap((surface, index) => (surface.interaction.type === "reflect" ? [index] : [])),',
    "the candidate set of LV's post-path search, checked on the run's own coarse/fine sets",
  );
  assertSource(
    "src/optics/trace/generalizedTrace.ts",
    'geometry.pathPlan.mode === "auto" || (explicitOrder !== null && explicitCursor >= explicitOrder.length)',
    "an explicit path continues with the reflective search after its last declared visit",
  );
  assertSource(
    "src/optics/trace/types.ts",
    "Opt-in sequential OPL capture; unavailable for generalized paths until phase-aware validation.",
    "v2 pathUnavailable is LV's own stated limitation",
  );
  assertSource(
    "src/optics/trace/aperture.ts",
    'apertureState = radius >= innerSemiDiameter - tolerance ? "inside" : "inside-hole";',
    "inner active limit is queried exactly rather than rounded",
  );
});

test(
  "diffractive trace records geometric segments only and paraxial phase uses its default wavelength",
  { skip },
  () => {
    assertSource(
      "src/optics/trace/sequentialTrace.ts",
      "if (options.recordOpticalPath) opticalPathLengthMm += hit.opticalPathLength ?? n * hit.segmentLength;",
      "rays.trace v3 keeps LV geometric OPL and declares phasePath unavailable",
    );
    assert.equal(occurrences("src/optics/trace/sequentialTrace.ts", "opticalPathLengthMm +="), 1);
    assertSource(
      "src/optics/math/paraxial.ts",
      "const phasePower = diffractiveParaxialPower(surface.diffractive);",
      "LV first order uses default phase wavelength, not the requested spectral line",
    );
    assertSource(
      "src/optics/math/diffractivePhase.ts",
      "export const DEFAULT_PHASE_WAVELENGTH_NM = LINE_NM.d;",
      "manifest binding of the phase paraxial wavelength",
    );
    assertSource(
      "src/optics/math/diffractivePhase.ts",
      "return -2 * quadraticCoefficient * diffractiveWavelengthScale(phase, wavelengthNm);",
      "first-order v2 convention",
    );
    assertSource(
      "src/optics/math/diffractivePhase.ts",
      "radialPower: term.radialPower, coefficient: term.coefficient, derivativeCoefficient: term.radialPower * term.coefficient,",
      "exportPhase validates prepared caches, reads literal physical coefficients, and invents no normalization",
    );
  },
);

test("LV radial phase powers include odd exponents through 32", { skip }, () => {
  assertSource(
    "src/optics/prescription/validate/diffractive.ts",
    "term.radialPower < 2 || term.radialPower > 32",
    "contract phase exponents preserve LV's full range, including odd powers",
  );
  assertSource(
    "src/optics/prescription/validate/diffractive.ts",
    "phase.terms.length < 1 || phase.terms.length > 16",
    "contract radial phase term count",
  );
});

// Stage 6.2, at LV 879c06102: the spot sets of the coma and bokeh tabs (src/engines/lv/spotRaySets.ts) and the
// engine's answer of the tabs (src/engines/lv/spot.ts) restate these lines.
test("the coma and bokeh tabs still draw the patterns and fields the spot sets restate", { skip }, () => {
  const coma = "src/optics/analysis/aberration/coma.ts";
  const bokeh = "src/optics/analysis/bokeh/bokeh.ts";
  const mirror = "lvSpotPatterns and lvSpotSetup in src/engines/lv/spotRaySets.ts restate the tabs' patterns";
  assertSource(
    coma,
    "const meridionalSampleCount = Math.max(3, Math.round(sampling.comaFanSampleCount ?? MERIDIONAL_COMA_SAMPLE_COUNT));",
    mirror,
  );
  assertSource(
    coma,
    "const circularPupilSamples = sampleCircularPupil( sampling.comaRingSamples ?? COMA_PREVIEW_CIRCULAR_PUPIL_RING_SAMPLES, );",
    mirror,
  );
  assertSource(coma, 'tangentialPupilSamples: sampleOrthogonalPupilFan(meridionalSampleCount, "tangential"),', mirror);
  assertSource(coma, 'sagittalPupilSamples: sampleOrthogonalPupilFan(meridionalSampleCount, "sagittal"),', mirror);
  assertSource(coma, "fieldFractions: sampling.comaFieldFractions ?? COMA_PREVIEW_FIELD_FRACTIONS,", mirror);
  assertSource(
    coma,
    "fieldGeometryState: fieldGeometry ?? computeAnalysisFieldGeometryAtState(focusT, zoomT, L, aberrationT),",
    mirror,
  );
  // The detail field of the fans, and the fans the tab draws no field of.
  assertSource(coma, "const candidate = sampling.comaDetailFieldFraction ?? L.offAxisFieldFrac;", mirror);
  assertSource(
    coma,
    "return isFinite(candidate) && candidate >= 0 && candidate <= 1 ? candidate : L.offAxisFieldFrac;",
    mirror,
  );
  assertSource(coma, "if (tracedField === null || tracedField.geometry.fieldAngleDeg <= 0) return null;", mirror);
  assertSource(coma, "meridionalFootprint === null || meridionalFootprint.fieldAngleDeg <= 0", mirror);
  // What a ray of the point cloud and of a bokeh tile weighs.
  assertSource(coma, "weight: sample.weight ?? 0,", "the area weights of the coma cloud's sets");
  assertSource(
    bokeh,
    "weight: (sample.weight ?? 1) * (sample.trace.transmission ?? 1),",
    "the bokeh sets weigh area times LensVisualizer's bulk transmission (lvRayWeights)",
  );
  assertSource(
    bokeh,
    "circularPupilSamples: sampleCircularPupil(sampling.bokehRingSamples ?? BOKEH_CIRCULAR_PUPIL_RING_SAMPLES),",
    mirror,
  );
  assertSource(bokeh, "const fieldFractions = sampling.bokehFieldFractions ?? BOKEH_PREVIEW_FIELD_FRACTIONS;", mirror);
  // A tile asked of one field samples LensVisualizer's own rings whatever the request's sampling says.
  assertSource(
    bokeh,
    "const context = buildBokehTraceContext(request, request.preparedGeometry.focusT, {});",
    "answerLvSpot refuses a bokeh tile of other rings (pupil.rings)",
  );
  // The tile's own request: the coma tab's dynamicEFL is never read, and the bokeh tab makes its own.
  assertSource(bokeh, "dynamicEFL: L.EFL,", "tabRequest in src/engines/lv/spot.ts hands the tabs dynamicEFL 0");
  // Both tabs trace with no chromatic channel, on the authored indices: answerLvSpot refuses a case whose line 0 is
  // not those indices (lines.not-authored-reference), as docs/gotchas.md says.
  const authored = "answerLvSpot answers only a case whose line 0 is the authored indices";
  assertSource(coma, "const bundle = traceOffAxisBundleFromSamples(request, samples, geometry, undefined);", authored);
  assertSource(
    bokeh,
    "const bundle = traceOffAxisBundleFromSamples(context.request, context.circularPupilSamples, geometry, undefined);",
    authored,
  );
  // The tab draws its infinity grid at its own best focus, not on the design plane: R7b asks the tile on the case's
  // plane, and docs/gotchas.md says the tab's own plane is not compared.
  assertSource(
    bokeh,
    "const infSensorZ = infContext.bestFocusZ + (viewContext.layout.imgZ - infContext.layout.imgZ) + (infContext.bestFocusZ - viewContext.bestFocusZ);",
    "computeBokehFieldFootprint is asked at the case's imageZ, never at the tab's sensorZ",
  );
});

// Stage 6.8b, at LV 607ff23ae (closure f016b35b): since LV #927 every sample of a tab's pupil is the shared aimed
// launch's ray through its point of the real stop; the spot, axial and curvature sets keep those rays verbatim.
test("a sample of the tabs' pupil is still the aimed launch's ray, traced as the spot sets state it", { skip }, () => {
  const offAxis = "src/optics/analysis/aberration/offAxis.ts";
  const aimed = "src/optics/analysis/pupils/aimedPupil.ts";
  const mirror = "lvSpotFieldRays in src/engines/lv/spotRaySets.ts takes the aimed launch's rays verbatim";
  assertSource(offAxis, "const launch = prepareAimedPupilLaunch(request, samples, geometry, channel);", mirror);
  assertSource(offAxis, 'if (launch === null || launch.chief.status !== "aimed") return null;', "lv-chief-unaimed");
  assertSource(offAxis, "const tracer = prepareAimedPupilTrace(request.preparedGeometry, launch, channel);", mirror);
  assertSource(offAxis, "const chiefTrace = tracer.skew(launch.chief);", "the chief ray of a spot set is launch.chief");
  assertSource(
    offAxis,
    'if (ray.status === "unaimed") { unaimedSamples.push({ sourceSampleIndex: sample.index, reason: ray.reason }); return []; }',
    "an unaimed sample holds the chief ray at weight 0: LensVisualizer never traces it",
  );
  assertSource(
    offAxis,
    'if (ray.status === "blocked") { blockedSampleCount++; return []; }',
    "a blocked sample keeps LensVisualizer's blocking ray, which every engine stops",
  );
  assertSource(offAxis, "const trace = tracer.skew(ray); if (trace.clipped) return [];", mirror);
  assertSource(offAxis, "const fieldAngleDeg = geometry.halfFieldDeg * fieldFraction;", "lvSpotFieldAngle");
  // A sample's ray is its own: the same asked alone, in any list, or not at all (the bokeh tile's chief ray is asked
  // with no sample, an axial zone in the sets' lists, not the sections').
  const own = "lvBokehChiefLanding and lvAxialPairs ask the aimed launch with lists of their own";
  assertSource(
    aimed,
    "itself: no state carries between samples, and the per-field model reused across calls is the one a fresh build",
    own,
  );
  assertSource(aimed, "const chief = toRay(-1, 0, 0, 0);", own);
  // The tabs trace with the stop at the launch's clip radius: the integration tests trace so.
  assertSource(
    aimed,
    "checkSemiDiameter: true, stopSemiDiameter: launch.clipSemiDiameterMm, stopOnClip: true, directionNormalized: true, launchBoundT: launch.launchBoundT, ...spectralTraceOptions(state, spectrum),",
    "test/integration/lv/spotRays.test.ts and its siblings trace a set with prepareAimedPupilTrace",
  );
  // The bokeh tile's chief ray, intercepted at the tile's plane: bokehChiefLanding in src/engines/lv/spot.ts.
  assertSource(
    "src/optics/analysis/bokeh/bokeh.ts",
    "const chiefDefocused: SkewImagePlaneIntercept | null = skewImagePlaneIntercept( bundle.chiefRay.trace.x, bundle.chiefRay.trace.y, bundle.chiefRay.trace.ux, bundle.chiefRay.trace.uy, geometry.lastSurfZ, sensorZ, );",
    "bokehChiefLanding in src/engines/lv/spot.ts lands the tile's chief ray so",
  );
  // The skew launch of the chief sets and of the curvature sets' parabasal rays (lvSkewLaunch).
  const adapters = "src/optics/trace/rayAdapters.ts";
  const skew = "lvSkewLaunch in src/engines/lv/spotRaySets.ts restates the skew launch";
  assertSource(adapters, "const lead = state.lens.constants.rayLead ?? 0;", skew);
  assertSource(adapters, "const skewFirstZ = scalarSkewState.z[0] ?? 0;", skew);
  assertSource(adapters, "const direction = skewDirectionForSlopes(ux0, uy0);", skew);
  assertSource(adapters, "const origin: Vec3 = [x0 - ux0 * lead, y0 - uy0 * lead, skewFirstZ - lead];", skew);
  assertSource(adapters, "const direction = directionFromSkewSlope(ux, uy) ?? ([0, 0, 1] as Vec3);", skew);
});

test(
  "the analysis drawer still hands the tabs the hook's radii and field geometry, and its quality's sampling",
  { skip },
  () => {
    const drawer = "src/components/layout/lensDiagram/AnalysisDrawerContent.tsx";
    const mirror = "tabRequest in src/engines/lv/spot.ts restates the drawer's request";
    assertSource(drawer, "currentEPSD: analysisInputs.currentEPSD,", mirror);
    assertSource(drawer, "currentPhysStopSD: analysisInputs.currentPhysStopSD,", mirror);
    assertSource(drawer, "fieldGeometry: analysisInputs.fieldGeometry,", mirror);
    assertSource(drawer, "sampling: analysisSampling,", mirror);
    assertSource(
      "src/optics/analysis/analysisQuality.ts",
      'return quality === "interactive" ? INTERACTIVE_ANALYSIS_SAMPLING : undefined;',
      "the settled tabs, whose sampling is every family default, are the ones restated",
    );
    assertSource(
      "src/components/hooks/useLensComputation.ts",
      "() => (L ? computeAnalysisFieldGeometryAtState(focusT, zoomT, L, aberrationT) : null),",
      "lvSpotSetup hands the tabs the hook's field geometry, computed alike",
    );
  },
);

// Stage 6.3, at LV 45e6f852d (closure afef1f81), reread at 098c91ef6 (closure fef2e248: the channels' indices anchored):
// the axial sets of the spherical-aberration and axial-colour sections (src/engines/lv/axialRaySets.ts) restate these
// lines; test/integration/lv/axialRays.test.ts holds their figures.
test(
  "the spherical-aberration and axial-colour sections still trace the zones the axial sets restate",
  { skip },
  () => {
    const spherical = "src/optics/analysis/aberration/spherical.ts";
    const shared = "src/optics/analysis/aberration/shared.ts";
    const chromatic = "src/optics/analysis/chromatic/analysis.ts";
    const mirror =
      "lvAxialZones in src/engines/lv/axialZones.ts and lvAxialPairs in src/engines/lv/axialRaySets.ts restate the sections' zones";
    // Since LV #927 every zone is the aimed launch's ray of the axial object through its fraction of the stop.
    assertSource(
      spherical,
      "const SA_ZONE_FRACTIONS = [ ...new Set(symmetricZoneFractions([NEAR_AXIS_REAL_FRAC, ...MARGINAL_FRACS, ...PROFILE_FRACS])), ];",
      mirror,
    );
    assertSource(spherical, "const zones = prepareAxialZoneLaunch(request, SA_ZONE_FRACTIONS);", mirror);
    assertSource(
      spherical,
      "const nearAxisSample = computeSymmetricRealSample(request, lastSurfZ, imagePlaneZ, NEAR_AXIS_REAL_FRAC, zones);",
      mirror,
    );
    assertSource(spherical, "for (const fraction of MARGINAL_FRACS) { if (zones.unaimed(fraction)) break;", mirror);
    assertSource(
      spherical,
      "marginalSample = computeSymmetricRealSample(request, lastSurfZ, imagePlaneZ, fraction, zones);",
      mirror,
    );
    assertSource(
      spherical,
      "const zones = prepareAxialZoneLaunch(request, symmetricZoneFractions(PROFILE_FRACS));",
      "the profile's zones, asked of the launch in a list of their own: the same rays (a sample's solve is its own)",
    );
    // Both the figures and the profile trace the profile's zones, each with its mirror image, and drop a zone whole.
    assert.equal(occurrences(spherical, "const hits = PROFILE_FRACS.flatMap((fraction) => {"), 2, mirror);
    assert.equal(
      occurrences(spherical, "const plusHit = computeRealRayHit(request, lastSurfZ, imagePlaneZ, fraction, zones);"),
      2,
      mirror,
    );
    assert.equal(
      occurrences(spherical, "const minusHit = computeRealRayHit(request, lastSurfZ, imagePlaneZ, -fraction, zones);"),
      2,
      mirror,
    );
    assertSource(spherical, "if (plusHit === null || minusHit === null) return [];", mirror);
    assertSource(shared, "export const MARGINAL_FRACS = MARGINAL_PUPIL_FRACTIONS;", mirror);
    assertSource(shared, "const AXIAL_FIELD: AimedObjectPlaneField = { uField: 0, yChief: 0 };", "LV_AXIAL_FIELD");
    assertSource(shared, "const samples = signedFractions.map((yFraction) => ({ xFraction: 0, yFraction }));", mirror);
    assertSource(shared, "const launch = prepareAimedPupilLaunch(request, samples, AXIAL_FIELD, channel);", mirror);
    assertSource(shared, "trace: prepareAimedPupilTrace(request.preparedGeometry, launch, channel),", mirror);
    assertSource(shared, "return fractions.flatMap((fraction) => [fraction, -fraction]);", mirror);
    assertSource(
      shared,
      'const aimed = zones.ray(signedFraction); if (aimed === null || aimed.status === "unaimed") return null; const ray = zones.trace.meridional(aimed);',
      "an unaimed zone has no pair (lv-zone-unaimed); a traced zone is the launch's ray, traced as the launch's",
    );
    // The axial-colour section: its candidates, each aimed at every zone channel's own indices (LV #930: R, G, B, V,
    // whichever are shown), the zone chosen from all four.
    assertSource(
      chromatic,
      "const fractions = normalizeFractions(options.longitudinalFractions, DEFAULT_LONGITUDINAL_CHROMATIC_FRACTIONS, { allowZero: false, });",
      mirror,
    );
    assertSource(
      chromatic,
      ".filter((value) => isFinite(value) && (allowZero ? value >= 0 : value > 0)) .map((value) => Math.max(0, Math.min(1, value)));",
      "normalizedFractions in src/engines/lv/axialZones.ts",
    );
    assertSource(chromatic, "return Array.from(new Set(values));", "normalizedFractions keeps each fraction once");
    assertSource(chromatic, "longitudinalFractions: request.sampling.chromaticLongitudinalFractions,", mirror);
    assertSource(
      chromatic,
      "CHROMATIC_ZONE_CHANNELS.map((channel) => [channel, prepareAxialZoneLaunch(request, fractions, channel)]),",
      "the colour sets aim each channel's zones at its own indices, at the line of the channel",
    );
    // The zone the section chooses: the first all four channels pass, else the first two do; an unaimed zone ends the
    // search. test/integration/lv/axialRays.test.ts restates the choice.
    const zone = "chosenZone in test/integration/lv/axialRays.test.ts restates the choice";
    assertSource(
      chromatic,
      'const aimed = zonesByChannel.get(channel)?.ray(fraction); if (aimed?.status === "unaimed") { searchEndedBy = { fraction, channel, reason: aimed.reason }; return; }',
      zone,
    );
    assertSource(chromatic, "const chosen = selectChromaticZone(candidates(), CHROMATIC_ZONE_CHANNELS.length);", zone);
    assertSource(
      "src/optics/chromatic/zoneSelection.ts",
      "if (zone.omittedChannels.length === 0) return zone; if (channelCount - zone.omittedChannels.length >= 2) firstTwoChannelZone ??= zone;",
      zone,
    );
    assertSource(
      "src/optics/chromatic/zoneSelection.ts",
      'if (ray.clipped) return "vignetted"; return Math.abs(ray.u) > 1e-15 ? null : "no-axis-crossing";',
      zone,
    );
  },
);

test("the sections' reading of a ray is still the one the axial sets' figures restate", { skip }, () => {
  // A channel's trace takes the channel's index of each medium: test/integration/lv/axialRays.test.ts traces so.
  assertSource(
    "src/optics/analysis/pupils/aimedPupil.ts",
    "indexAtSurface: (i, nd) => state.lens.dispersion[i]?.indexAt(spectrum) ?? nd, wavelengthNm: CHROMATIC_CHANNEL_WAVELENGTH_NM[spectrum],",
    "the colour sets are traced at a channel's indices as prepareAimedPupilTrace traces them",
  );
  // Where a ray crosses the axis, and its height on a plane: the definition of src/estimators/axialIntercept.ts.
  const definition = "axialIntercept in src/estimators/axialIntercept.ts is this crossing, rounded once";
  assertSource(
    "src/optics/analysis/aberration/shared.ts",
    "if (Math.abs(u) < MIN_SLOPE) return null; return lastSurfZ - y / u;",
    definition,
  );
  assertSource("src/optics/chromatic/chromaticTrace.ts", "axialIntercepts[ch] = rayZ - ray.y / ray.u;", definition);
  assertSource("src/optics/chromatic/chromaticTrace.ts", "imagePlaneHeights[ch] = ray.y + dz * ray.u;", definition);
  // The least-squares focus of the profile's pairs: sum u^2 z / sum u^2 (leastSquaresFocus), and the RMS about the axis.
  const focus = "leastSquaresFocus in src/estimators/axialIntercept.ts is this focus and RMS";
  assertSource(
    "src/optics/analysis/aberration/shared.ts",
    "const denom = hits.reduce((sum, hit) => sum + hit.slope * hit.slope, 0);",
    focus,
  );
  assertSource(
    "src/optics/analysis/aberration/shared.ts",
    "return sum + hit.slope * hit.slope * referenceZ - hit.coordinate * hit.slope;",
    focus,
  );
  assertSource(
    "src/optics/analysis/aberration/spherical.ts",
    "const bestFocusRmsMm = rmsAtPlane(hits, lastSurfZ, bestFocusZ);",
    focus,
  );
  assertSource(
    "src/optics/analysis/aberration/spherical.ts",
    "transverseSaMm: transverseCoordinateAtPlane(plusHit, lastSurfZ, bestFocusZ) - nearAxisHeightAtBestFocus,",
    "sphericalFigures' profile is each zone's plus ray at the focus less the near-axis plus ray's",
  );
});

test(
  "the aberrations and chromatic tabs still present the sections the engine answers axial.native from",
  { skip },
  () => {
    const mirror = "answerLvAxial in src/engines/lv/axial.ts asks these functions as the tabs do";
    const data = "src/components/display/analysis/aberrations/useSphericalAberrationData.ts";
    assertSource(
      data,
      'const saResult = probe("computeSphericalAberration", () => context.computeSphericalAberration());',
      mirror,
    );
    assertSource(data, "const saProfile = context.computeSAProfile();", mirror);
    const chromatic = "src/components/display/analysis/ChromaticTab.tsx";
    assertSource(chromatic, "const longitudinal = analysis.longitudinalFocus;", mirror);
    assertSource(
      "src/optics/analysis/chromatic/analysis.ts",
      "longitudinalFocus: computeLongitudinalChromaticFocus(request, options),",
      mirror,
    );
    // The chart plots each channel's focus relative to the reference channel, LensVisualizer's G channel (the d line,
    // 587.56 nm, or e, 546.07 nm, in a lens of e-line indices; not Fraunhofer's g); the section's spherical aberration
    // is shown as a label of its sign, its number behind a flag.
    assertSource(
      "src/components/display/analysis/LongitudinalChromaticFocusChart.tsx",
      "const samples = result?.samples.filter((sample) => sample.usable && sample.relativeFocusShiftMm !== null) ?? [];",
      "R8b compares each line's focus relative to the first (relativeFocus.maxAbs), the chart's quantity",
    );
    assertSource(
      "src/optics/analysis/chromatic/analysis.ts",
      'return channels.includes("G") ? "G" : (channels[0] ?? "G");',
      "the reference channel is G, the d (or e) line: a case's reference line",
    );
    assertSource(
      "src/utils/featureFlags.ts",
      "export const ENABLE_REAL_RAY_LSA_DIAGNOSTIC = false;",
      "docs/REFERENCE.md says the LSA is shown as a label",
    );
    // The line of each channel, by the lens's index reference (lvChannelLines).
    const channels = "src/optics/chromatic/channels.ts";
    const lines = "lvChannelLines in src/engines/lv/axial.ts restates which line a channel is";
    assertSource(
      channels,
      'export const CHROMATIC_CHANNEL_ORDER = Object.freeze(["R", "G", "B", "V"] as const);',
      lines,
    );
    assertSource(channels, 'export const CHROMATIC_CHANNEL_WAVELENGTH_NM = channelWavelengths("d");', lines);
    assertSource(channels, 'export const E_LINE_CHANNEL_WAVELENGTH_NM = channelWavelengths("e");', lines);
    assertSource(
      channels,
      'return elements.length > 0 && elements.every((element) => element.indexReference === "e") ? "e" : "d";',
      lines,
    );
    // The elements the chromatic tab asks it of, the path lvChannelLines reads: the runtime lens's elements, which are
    // the compiled elements' sources without the synthetic rear plates.
    assertSource(
      "src/components/display/analysis/ChromaticTab.tsx",
      "const channelReference = lensChromaticReference(L.elements);",
      "lvChannelLines asks lensChromaticReference of model.runtime.elements, the tab's L.elements",
    );
    assertSource(
      "src/optics/prescription/runtimeView.ts",
      "elements: lens.elements.map((element) => element.source).filter((element) => !element.synthetic),",
      "model.runtime.elements are the elements the chromatic tab's L holds",
    );
    // A channel of an e-line element is of the C', e, F' and g lines: an element's own reference decides its media.
    assertSource(
      "src/optics/chromatic/materialResolver.ts",
      'if (entry && element.indexReference === "e") {',
      "lvChannelLines refuses a lens whose elements mix references (lines.mixed-reference)",
    );
    // Since 5ba17c20c a glass LensVisualizer matched to a catalog is anchored to its authored index on both reference
    // lines: its G channel is the authored index, C, F and g the catalog's dispersion added to it, g reconstructed from
    // an element's own partial dispersion where it states one (docs/gotchas.md, "Axial rays").
    const resolver = "src/optics/chromatic/materialResolver.ts";
    const anchoring = "sampling.indexMaxDelta of answerLvAxial and docs/gotchas.md rest on this";
    assertSource(
      resolver,
      "const nd = surface.nd; const anchor = nd - evaluateSellmeier(entry, CHANNEL_NM.G);",
      anchoring,
    );
    assertSource(resolver, "const nR = evaluateSellmeier(entry, CHANNEL_NM.R) + anchor;", anchoring);
    assertSource(resolver, "const nB = evaluateSellmeier(entry, CHANNEL_NM.B) + anchor;", anchoring);
    assertSource(resolver, ": evaluateSellmeier(entry, CHANNEL_NM.V) + anchor;", anchoring);
    assertSource(resolver, "? nB + normalLinePgF(element.vd, element.dPgF) * (nB - nR)", anchoring);
    assertSource(
      resolver,
      'const fn: SurfaceIndexFn = (ch) => (ch === "R" ? nR : ch === "B" ? nB : ch === "V" ? nV : nd);',
      anchoring,
    );
    assertSource(resolver, "const anchor = ne - evaluateSellmeier(entry, E_LINE_CHANNEL_NM.G);", anchoring);
    // The case's anchored index adds the same terms in another order: within a unit in the last place of the channel's.
    assertSource(
      "src/optics/chromatic/indexResolver.ts",
      "surface.nd + evaluateSellmeier(dispersion.glassEntry, wavelengthNm) - evaluateSellmeier(dispersion.glassEntry, referenceNm)",
      "docs/gotchas.md: at C and F a channel's index is within a rounding of the case's, never exactly by construction",
    );
    assertSource(
      "src/optics/trace/rayAdapters.ts",
      "indexAtSurface: channel ? (i, nd) => state.lens.dispersion[i]?.indexAt(channel) ?? nd : undefined,",
      anchoring,
    );
  },
);

// Stage 6.4, at LV d6df08c7f and cfa91d0a5 (closure c866fbff with the stage's names), reread at 098c91ef6 (closure
// fef2e248: the chief ray solved below one degree, each channel's own lateral colour): the chief sets of the
// distortion, pupils and lateral-colour tabs (src/engines/lv/chiefRaySets.ts, the request and reference in
// chiefSetup.ts) restate these lines; test/integration/lv/chiefRays.test.ts holds the tabs' figures to the bit.
test("the distortion tab still traces the probe, the edge and its samples the chief sets restate", { skip }, () => {
  const distortion = "src/optics/analysis/distortion/distortion.ts";
  const image = "src/optics/field/imageHeight.ts";
  const reference = "lvDistortionReference in src/engines/lv/chiefSetup.ts restates the rectilinear reference";
  const curve = "curveRays in src/engines/lv/chiefRaySets.ts restates the curve's chief rays";
  assertSource(
    distortion,
    "const scaleProbeAngleDeg = Math.min(Math.max(geometry.halfFieldDeg * 0.01, 0.02), 0.5);",
    reference,
  );
  assertSource(
    distortion,
    "const probeImageHeight = chiefRayImageHeight(scaleProbeAngleDeg, zPos, focusT, zoomT, L, geometry, aberrationT);",
    reference,
  );
  assertSource(distortion, "const probeLaunch = projectionLaunchSlopeForField(L, scaleProbeAngleDeg);", reference);
  assertSource(distortion, "const probeTan = -probeLaunch.uField;", reference);
  assertSource(distortion, "const rectilinearScale = -probeImageHeight / probeTan;", reference);
  assertSource(
    distortion,
    "const projectionReference = distortionProjectionReferenceForLens(L, rectilinearScale, zoomT);",
    reference,
  );
  assertSource(
    distortion,
    "chiefRayImageHeightForRuntimeLens as chiefRayImageHeight, chiefRayImageHeightAccurateForRuntimeLens as chiefRayImageHeightAccurate,",
    reference,
  );
  assertSource(distortion, "const edgeImageHeight = chiefRayImageHeightAccurate( geometry.halfFieldDeg,", curve);
  assertSource(distortion, "const zPos = state.z as number[];", "the curve's rays start at the state's first vertex");
  assertSource(distortion, "if (isFisheyeProjection(L.projection)) {", "a fisheye lens has no distortion sets");
  // The samples: the angle the inversion solved for each target, which the curve plots as its real height; the axis
  // a sample the curve states and does not trace. The inversion accepts a ray within 1e-4 mm of its target.
  assertSource(distortion, "const fieldAngleDeg = inversion.fieldAngleDeg;", curve);
  assertSource(
    distortion,
    "const realHeight = targetImageHeights[targetIndex];",
    "docs/gotchas.md: the curve plots its targets",
  );
  assertSource(
    image,
    "if (!Number.isFinite(height) || Math.abs(height + Math.abs(target)) >= 1e-4)",
    "docs/gotchas.md: a sample's chief ray lands within 1e-4 mm of its target",
  );
  const plotted = "test/integration/lv/chiefRays.test.ts restates the plotted percent";
  assertSource(
    distortion,
    "const idealHeight = -projectionImageHeightForAngle(reference.projectionReference, thetaRad);",
    plotted,
  );
  assertSource(distortion, "const distortionPercent = (100 * (realHeight - idealHeight)) / idealHeight;", plotted);
  assertSource("src/optics/field/projection.ts", "return reference.focalScaleMm * Math.tan(fieldAngleRad);", plotted);
  // The probe is the chief ray of the paraxial pupil; the edge and the samples the solved chief ray, each a
  // meridional launch through the state's own vertices.
  assertSource(image, "const yChief = -geom.epRatio * uField;", "probeLaunch in src/engines/lv/chiefRaySets.ts");
  assertSource(
    image,
    ": prepareRayTraceForState(stateWithZ(state, zPos), { ghost: true }).ray(yChief, uField);",
    curve,
  );
  assertSource(image, "const solve = solveChiefRay(state, { fieldAngleDeg, geometry });", curve);
  assertSource(
    image,
    ": prepareRayTraceForState(stateWithZ(state, zPos), { ghost: true }).ray(solve.yLaunch, launch.uField);",
    curve,
  );
  assertSource(image, "return trace.y + trace.u * imagePlaneTransfer;", plotted);
  // Since 5ba17c20c every chief ray but the axis's is solved through the stop's centre, below one degree too, to a
  // tolerance that shrinks with the field there; the axis is 0, unsolved. The probe above stays a paraxial launch.
  const solve = "src/optics/field/chiefRaySolve.ts";
  const below = 'docs/gotchas.md, "Chief rays": LensVisualizer\'s chief ray below one degree, solved since 5ba17c20c';
  assertSource(
    solve,
    'if (fieldAngleDeg === 0) { return { yLaunch: 0, uField, status: "converged", iterations: 0, launchSurface }; }',
    below,
  );
  assertSource(
    solve,
    "return CHIEF_RAY_RESIDUAL_TOLERANCE * Math.min(1, Math.abs(fieldAngleDeg) / CHIEF_RAY_RESIDUAL_FULL_FIELD_DEG);",
    below,
  );
  assert.equal(occurrences(solve, "Math.abs(fieldAngleDeg) < 1"), 0, `${solve} has a shortcut below one degree again`);
  // The meridional launch of a slope: LensVisualizer's own normalisation, cached for the slope 0.
  assertSource(
    "src/optics/trace/rayAdapters.ts",
    "const direction = directionFromMeridionalSlope(u) ?? ([0, 0, 1] as Vec3);",
    "lvMeridionalLaunch in src/engines/lv/chiefRaySets.ts",
  );
});

test("the distortion grid still corrects its launches by the table the chief sets restate", { skip }, () => {
  const distortion = "src/optics/analysis/distortion/distortion.ts";
  const grid = "gridRays and pupilCorrectionTable in src/engines/lv/chiefRaySets.ts restate the grid's launches";
  assertSource(distortion, "const PUPIL_CORRECTION_SAMPLE_COUNT_FULL = 17;", grid);
  assertSource(distortion, "const PUPIL_CORRECTION_SAMPLE_COUNT_HEAVY = 9;", grid);
  assertSource(
    distortion,
    "isHeavyLensForRayWork(L) ? PUPIL_CORRECTION_SAMPLE_COUNT_HEAVY : PUPIL_CORRECTION_SAMPLE_COUNT_FULL,",
    grid,
  );
  assertSource(
    distortion,
    "const angleDeg = uniformFieldFraction(i, sampleCount) * reference.geometry.halfFieldDeg;",
    grid,
  );
  assertSource(distortion, "table.push({ angleDeg, ratio: 1 });", grid);
  assertSource(distortion, "const paraxialYChief = -reference.geometry.epRatio * launch.uField;", grid);
  assertSource(
    distortion,
    "const solvedYChief = solveChiefRay(angleDeg, focusT, zoomT, L, reference.geometry, aberrationT).yLaunch;",
    grid,
  );
  assertSource(distortion, "const ratio = Math.abs(paraxialYChief) > 1e-12 ? solvedYChief / paraxialYChief : 1;", grid);
  assertSource(distortion, "table.push({ angleDeg, ratio: isFinite(ratio) ? ratio : 1 });", grid);
  assertSource(distortion, "if (angleDeg <= table[0].angleDeg) return table[0].ratio;", grid);
  assertSource(
    distortion,
    "const t = (angleDeg - table[i].angleDeg) / (table[i + 1].angleDeg - table[i].angleDeg);",
    grid,
  );
  assertSource(distortion, "return table[i].ratio + t * (table[i + 1].ratio - table[i].ratio);", grid);
  assertSource(
    distortion,
    "const fieldSlopes = projectionFieldSlopesForImagePoint(reference.projectionReference, idealX, idealY);",
    grid,
  );
  assertSource(
    distortion,
    "let correction = interpolatePupilCorrection(pupilCorrection, launch.equivalentAngleDeg);",
    grid,
  );
  assertSource(distortion, "if (reference.objectVergence !== 0) {", "at infinity focus the slope is not rescaled");
  assertSource(distortion, "const correctedEpRatio = reference.geometry.epRatio * correction;", grid);
  assertSource(
    distortion,
    "return adapter.skew(-correctedEpRatio * fieldSlopeX, -correctedEpRatio * fieldSlopeY, fieldSlopeX, fieldSlopeY);",
    grid,
  );
  assertSource(
    distortion,
    "const traceOptions = { focusT, zoomT, stopSD: currentPhysStopSD, ghost: true, aberrationT };",
    "the grid traces with the case's stop radius",
  );
  assertSource(distortion, "if (!insideImageCircle) {", "a point outside the image circle is no ray of the grid");
  assertSource(
    "src/optics/analysis/analysisContext.ts",
    "analysisJobs.computeDistortionFieldGrid({ ...request, sampling: {} }),",
    "the drawer asks the grid with no sampling of its own, as lvChiefRequest does",
  );
});

test("the pupils tab still traces the fields and chief rays the chief sets restate", { skip }, () => {
  const pupils = "src/optics/analysis/pupils/pupilAberration.ts";
  const mirror =
    "lvPupilFields in src/engines/lv/chiefFields.ts restates the pupils tab's fields, for the sets and lv alike";
  const answer = "answerLvChief in src/engines/lv/chief.ts makes the tab's pupils absolute";
  assertSource(
    pupils,
    "const sampleCount = request.sampling.pupilAberrationSampleCount ?? PUPIL_ABERRATION_SAMPLE_COUNT;",
    mirror,
  );
  assertSource(pupils, "const n = Math.max(sampleCount, 2);", mirror);
  assertSource(
    pupils,
    "const fieldFrac = uniformFieldFraction(i, n); const fieldDeg = fieldFrac * halfFieldDeg;",
    mirror,
  );
  assertSource(pupils, 'if (launch.status === "out-of-domain" && !solve.vectorLaunch) {', mirror);
  assertSource(pupils, "if (Math.abs(fieldDeg) > 1e-9) {", mirror);
  assertSource(pupils, ": prepared.ray(yChief, uField);", mirror);
  assertSource(
    pupils,
    "const prepared = prepareRayTrace(L, { zPos, focusT, zoomT, ghost: true, aberrationT });",
    mirror,
  );
  assertSource(
    pupils,
    "const { z: zPos } = layoutFromPrepared(prepareState(compiledLensFromRuntime(L), focusT, zoomT, aberrationT));",
    "the pupils tab's first vertex is the layout's, the state's own",
  );
  assertSource(pupils, "if (focusT < FOCUS_INFINITY_CUTOFF && aberrationT === 0) {", answer);
  assertSource(
    pupils,
    "paraxialEpZRelStop: epZRelStopAtZoom(zoomT, L), paraxialXpZRelLastSurf: xpZRelLastSurfAtZoom(zoomT, L),",
    answer,
  );
  assertSource(
    pupils,
    "if (!isFinite(paraxialXpZRelLastSurf)) {",
    "a paraxial exit pupil at infinity: no chief ray traced",
  );
  assertSource(pupils, "chiefRayCorrection = isFinite(yChief) ? yChief / paraxialYChief : 1;", answer);
  assertSource(pupils, "epShiftMm = (chiefRayCorrection - 1) * epRatio;", answer);
  assertSource(pupils, "xpZRelLastSurf = -result.y / result.u;", answer);
  assertSource(
    "src/components/display/analysis/PupilAberrationTab.tsx",
    "const profiles = useMemo(() => context.computeBothPupilAberrationProfiles(), [context]);",
    answer,
  );
});

test("the lateral-colour section and the breathing chart still read what the comparator restates", { skip }, () => {
  const chromatic = "src/optics/analysis/chromatic/analysis.ts";
  const mirror = "lvLateralFractions and lvLateralChief in src/engines/lv/chiefFields.ts restate the section's fields";
  assertSource(
    chromatic,
    "fieldFractions: request.sampling.chromaticLateralFieldFractions ?? request.sampling.fieldCurvatureFieldFractions,",
    mirror,
  );
  assertSource(
    chromatic,
    "const fieldFractions = normalizeFractions(options.fieldFractions, DEFAULT_LATERAL_COLOR_FIELD_FRACTIONS, { allowZero: true, });",
    mirror,
  );
  assertSource(chromatic, "if (channels.length < 2 || currentEPSD <= 0 || L.N < 1) return null;", mirror);
  // The section's plane is the last vertex plus its gap: chief.ts decides focus.off-design from it before asking.
  assertSource(
    chromatic,
    "const imagePlaneZ = lastSurfaceZ + thick(L.N - 1, focusT, zoomT, L, aberrationT);",
    "designPlaneZ in src/engines/lv/chief.ts decides the lateral colour's design plane before the section is asked",
  );
  // Since 5ba17c20c each channel traces its own chief ray, solved through the stop at the channel's indices.
  assertSource(
    chromatic,
    "const geometries = channels.map((channel) => computeOffAxisChannelFieldGeometry(request.preparedGeometry, fieldFraction, channel, stateGeometry), );",
    mirror,
  );
  assertSource(chromatic, "const fieldGeometry = geometries.find((geometry) => geometry !== null);", mirror);
  assertSource(
    chromatic,
    "const chiefRay = geometry ? traceOffAxisChiefRay(request, geometry, channel) : null;",
    "lateralRays in src/engines/lv/chiefRaySets.ts launches each channel's geometry as the coma tab's chief ray",
  );
  assertSource(chromatic, "imageHeightMm: chiefRay?.imagePoint.y ?? null,", mirror);
  assertSource(
    "src/optics/analysis/aberration/offAxis.ts",
    "solvePreparedChiefRay(state, { fieldAngleDeg, geometry, channel }),",
    "computeOffAxisChannelFieldGeometry, which the binding takes, solves the chief ray at the channel",
  );
  // The section's channels: every one, in LensVisualizer's order (LV_LATERAL_CHANNELS in chiefFields.ts).
  const channels = "LV_LATERAL_CHANNELS in src/engines/lv/chiefFields.ts restates the section's channels";
  assertSource("src/optics/analysis/request.ts", "channels: CHROMATIC_CHANNEL_ORDER,", channels);
  assertSource(chromatic, "export const DEFAULT_CHROMATIC_ANALYSIS_CHANNELS = CHROMATIC_CHANNEL_ORDER;", channels);
  assertSource(chromatic, "return CHROMATIC_CHANNEL_ORDER.filter((channel) => requested.has(channel));", channels);
  assertSource(
    "src/optics/chromatic/channels.ts",
    'export const CHROMATIC_CHANNEL_ORDER = Object.freeze(["R", "G", "B", "V"] as const);',
    channels,
  );
  assertSource(chromatic, "lateralColor: computeLateralColorCurve(request, options),", mirror);
  // The breathing chart's focal length: the stored one at infinity focus, the prepared surfaces' elsewhere.
  const breathing = "test/integration/lv/breathing.test.ts holds the chart's focal length to lv's R1 answer";
  assertSource(
    "src/optics/analysis/summary/breathing.ts",
    "return eflAtPreparedState(request.preparedGeometry);",
    breathing,
  );
  assertSource(
    "src/optics/analysis/summary/breathing.ts",
    "for (let i = 0; i < SAMPLE_COUNT; i++) points.add(i / (SAMPLE_COUNT - 1));",
    breathing,
  );
  assertSource(
    "src/optics/first-order/focusBreathing.ts",
    "return L.isZoom && L.zoomEFLs ? interpolateStationTable(clampStationControl(zoomT), L.zoomEFLs) : L.EFL;",
    breathing,
  );
});

// Stage 6.5, at LV cfa91d0a5 (closure c866fbff with the stage's names): the curvature sets of the field-curve and
// astigmatism sections (src/engines/lv/curvatureRaySets.ts, the fields in curvatureFields.ts) restate these lines;
// test/integration/lv/curvatureRays.test.ts holds the sections' foci to the bit.
test(
  "the field-curve sections still trace the fields, the parabasal rays and the fans the curvature sets restate",
  { skip },
  () => {
    const curvature = "src/optics/analysis/aberration/fieldCurvature.ts";
    const fields = "lvCurvatureFractions and lvCurvatureFields in src/engines/lv/curvatureFields.ts restate the fields";
    const parabasal = "lvParabasalFraction and lvParabasalOffsets restate the four parabasal rays";
    const fans = "lvRealRayFans and realRayLaunches in src/engines/lv/curvatureRaySets.ts restate the real-ray fans";
    // The fields: the marked ones and the curve's, each computed on its own of its fraction alone.
    assertSource(
      curvature,
      "const fieldFractions = sampling.fieldCurvatureFieldFractions ?? FIELD_CURVATURE_FIELD_FRACTIONS;",
      fields,
    );
    assertSource(
      curvature,
      "const curveFieldFractions = sampling.fieldCurvatureCurveFieldFractions ?? FIELD_CURVATURE_CURVE_FIELD_FRACTIONS;",
      fields,
    );
    assertSource(
      curvature,
      "const fields = fieldCurvatureFieldMeta(fieldFractions).map((meta) => computeFieldCurvatureField(request, meta, false, stateGeometry), );",
      fields,
    );
    assertSource(
      curvature,
      "const curveFields = fieldCurvatureFieldMeta(curveFieldFractions).map((meta) => computeFieldCurvatureField(request, meta, false, stateGeometry), );",
      fields,
    );
    assertSource(
      curvature,
      "const stateGeometry = fieldGeometry ?? computeAnalysisFieldGeometryAtState(focusT, zoomT, L, aberrationT);",
      fields,
    );
    assertSource(
      curvature,
      "const geometry = computeOffAxisFieldGeometryScalar(request.preparedGeometry, meta.fieldFraction, stateGeometry);",
      fields,
    );
    assertSource(curvature, "if (geometry === null) return emptyFieldCurvatureFieldResult(meta);", fields);
    assertSource(
      curvature,
      "if (currentEPSD <= 0 || L.N < 1) return emptyFieldCurvatureFieldResult(meta);",
      "no-pupil",
    );
    // The design plane the shifts are from: the last vertex plus its gap (lvCurvaturePlaneZ).
    assertSource(
      curvature,
      "const imagePlaneZ = lastSurfZ + thick(L.N - 1, focusT, zoomT, L, aberrationT);",
      "lvCurvaturePlaneZ in src/engines/lv/curvatureFields.ts decides focus.off-design before the sections are asked",
    );
    // The four parabasal rays: 0.01 mm over the pupil radius, held between 1e-4 and 0.02, tangential then sagittal,
    // -1 then +1, beside the chief ray traced first.
    assertSource(curvature, "const FIELD_CURVATURE_PARABASAL_RAY_HEIGHT_MM = 0.01;", parabasal);
    assertSource(curvature, "const FIELD_CURVATURE_PARABASAL_FRACTION_MIN = 1e-4;", parabasal);
    assertSource(curvature, "const FIELD_CURVATURE_PARABASAL_FRACTION_MAX = 0.02;", parabasal);
    assertSource(
      curvature,
      "if (!isFinite(entrancePupilSemiDiameter) || entrancePupilSemiDiameter <= 0) { return FIELD_CURVATURE_PARABASAL_FRACTION_MIN; }",
      parabasal,
    );
    assertSource(
      curvature,
      "const fraction = FIELD_CURVATURE_PARABASAL_RAY_HEIGHT_MM / entrancePupilSemiDiameter;",
      parabasal,
    );
    assertSource(
      curvature,
      "return Math.min(FIELD_CURVATURE_PARABASAL_FRACTION_MAX, Math.max(FIELD_CURVATURE_PARABASAL_FRACTION_MIN, fraction));",
      parabasal,
    );
    assertSource(curvature, "const parabasalFraction = parabasalPupilFraction(currentEPSD);", parabasal);
    assertSource(curvature, 'const xFraction = direction === "sagittal" ? sign * parabasalFraction : 0;', parabasal);
    assertSource(curvature, 'const yFraction = direction === "tangential" ? sign * parabasalFraction : 0;', parabasal);
    assertSource(
      curvature,
      'const tangentialHits = ([-1, 1] as const) .map((sign) => traceRelativeRay("tangential", sign))',
      parabasal,
    );
    assertSource(
      curvature,
      'const sagittalHits = ([-1, 1] as const) .map((sign) => traceRelativeRay("sagittal", sign))',
      parabasal,
    );
    assertSource(curvature, "const chiefRay = traceOffAxisChiefRay(request, geometry, channel);", parabasal);
    assertSource(
      curvature,
      "xFraction, yFraction, geometry.yChief, geometry.uField, currentEPSD, focusT, zoomT, currentPhysStopSD, true, L, aberrationT,",
      parabasal,
    );
    assertSource(
      "src/optics/trace/chiefRelative.ts",
      "xFraction * entrancePupilSemiDiameter, chiefLaunchHeight + yFraction * entrancePupilSemiDiameter, 0, fieldSlope,",
      parabasal,
    );
    // traceSkewRay, the parabasal rays' adapter, starts a ray as the skew adapter of the spot sets does (lvSkewLaunch).
    const skew = "lvSkewLaunch in src/engines/lv/spotRaySets.ts starts each ray of a curvature set";
    assertSource("src/optics/trace/rayAdapters.ts", "const lead = L.rayLead ?? 0;", skew);
    assertSource(
      "src/optics/trace/rayAdapters.ts",
      "const origin: Vec3 = [x0 - ux0 * lead, y0 - uy0 * lead, (state.z[0] ?? 0) - lead];",
      skew,
    );
    // The real-ray fans: the coma tab's orthogonal fans at the sections' default count, from the scalar geometry, each
    // its own aimed launch (traceOffAxisBundleFromSamples, LV #927), relative to that launch's stop-centre ray.
    assertSource(
      curvature,
      "const diagnostic = computeDiagnosticFieldFocus(request, geometry, sampling.fieldCurvatureDiagnosticSampleCount);",
      fans,
    );
    assertSource(curvature, "sampleCount = MERIDIONAL_COMA_SAMPLE_COUNT,", fans);
    assertSource(
      curvature,
      'const tangentialBundle = traceOffAxisBundleFromSamples( request, sampleOrthogonalPupilFan(sampleCount, "tangential"), geometry, undefined, );',
      fans,
    );
    assertSource(
      curvature,
      'const sagittalBundle = traceOffAxisBundleFromSamples( request, sampleOrthogonalPupilFan(sampleCount, "sagittal"), geometry, undefined, );',
      fans,
    );
    // A one-sided fan has no real-ray focus in LV's section (fanGap); R10a's estimator takes the rays of both answers.
    const gap = "twoSided in test/integration/lv/curvatureRays.test.ts restates fanGap; lv's sampling omits the focus";
    assertSource(curvature, "const FIELD_CURVATURE_MIN_FAN_HALF_SPAN = 0.25;", gap);
    assertSource(curvature, 'if (bundle.validSampleCount < 3) return "too-few-rays";', gap);
    assertSource(curvature, "const fractions = bundle.samples.map((sample) => sample.pupilFraction ?? 0);", gap);
    assertSource(
      curvature,
      "Math.min(...fractions) <= -FIELD_CURVATURE_MIN_FAN_HALF_SPAN && Math.max(...fractions) >= FIELD_CURVATURE_MIN_FAN_HALF_SPAN;",
      gap,
    );
    // The chromatic field curves: the same rays at each channel, of the usable fields.
    const chromatic = "answerLvCurvature in src/engines/lv/curvature.ts reads each channel's shifts";
    assertSource(
      curvature,
      "const CHROMATIC_FIELD_CHANNELS: readonly ChromaticChannel[] = CHROMATIC_CHANNEL_ORDER;",
      chromatic,
    );
    assertSource(curvature, "const fieldFocus = computeStandardizedFieldFocus(request, geometry, channel);", chromatic);
    assertSource(curvature, "if (!field.usable) return { ...field, chromaticFieldShifts: null };", chromatic);
  },
);

test("the aberrations tab still presents the field curves the engine answers curvature.native from", { skip }, () => {
  const panel = "src/components/display/analysis/AberrationsPanel.tsx";
  const hook = "src/components/display/analysis/aberrations/useFieldCurvatureData.ts";
  const answer = "answerLvCurvature in src/engines/lv/curvature.ts asks computeFieldCurvatureBundle as the tab does";
  assertSource(panel, "const result = chromaticFieldCurvatureResult ?? fieldCurvatureResult;", answer);
  assertSource(hook, "analysisContext?.request ??", answer);
  assertSource(hook, "const bundle = context.computeFieldCurvatureBundle();", answer);
  assertSource(hook, "chromaticFieldCurvatureResult: bundle.chromaticFieldCurvature,", answer);
  // The shifts are from the design plane, + aft; the Petzval shift is paraxial, of the chief ray's landing.
  const curvature = "src/optics/analysis/aberration/fieldCurvature.ts";
  assertSource(curvature, "const tangentialShiftMm = tangentialBestFocusZ - geometry.imagePlaneZ;", answer);
  assertSource(curvature, "const sagittalShiftMm = sagittalBestFocusZ - geometry.imagePlaneZ;", answer);
  assertSource(curvature, "chiefImageHeight: chiefRay.imagePoint.y,", answer);
  assertSource(
    curvature,
    "const petzvalShiftMm = petzvalShiftAtImageHeight(chiefImageHeight, L.petzvalSum) ?? 0;",
    "the Petzval shift lv states in sampling is paraxial: no rung compares it",
  );
});

// Stage 6.6, at LV be077cbcd (closure c866fbff with the stage's names), Stage 6.6b, at LV 098c91ef6 (closure fef2e248),
// and Stage 6.8b, at LV 607ff23ae (closure f016b35b), whose tab (#931) is OpticStudio's two field analyses on one
// lattice on the real stop a field: the vignetting sets of the tab (src/engines/lv/vignettingRaySets.ts, the fields and
// the setup in vignettingFields.ts) restate these lines; test/integration/lv/vignettingRays.test.ts holds the tab's
// cells and curve to the bit.
test(
  "the vignetting tab still samples the fields and traces the lattices the vignetting sets restate",
  { skip },
  () => {
    const vignetting = "src/optics/analysis/vignetting/vignetting.ts";
    const fields =
      "lvVignettingFieldCount and lvVignettingFieldFractions in src/engines/lv/vignettingFields.ts restate the fields";
    const setup = "lvVignettingSetup in src/engines/lv/vignettingFields.ts restates the tab's setup";
    const lattices = "lvVignettingDecision, lvBeamLattice and lvBeamRays in src/engines/lv/vignettingFields.ts";
    // The fields: about every 3 degrees, at least 7, from the axis to the half field of the drawer's geometry.
    assertSource(
      vignetting,
      "const fieldCount = sampling.vignettingFieldSampleCount !== undefined ? Math.max(Math.round(sampling.vignettingFieldSampleCount), 3) : Math.max(Math.ceil(halfFieldDeg / 3) + 1, 7);",
      fields,
    );
    assertSource(
      vignetting,
      "const fractions = Array.from({ length: fieldCount }, (_, i) => uniformFieldFraction(i, fieldCount));",
      fields,
    );
    assertSource(
      vignetting,
      "request.fieldGeometry ?? computeAnalysisFieldGeometryAtState(state.focusT, state.zoomT, runtimeView(state.lens), state.aberrationT)",
      fields,
    );
    assertSource(
      vignetting,
      'if (!(halfFieldDeg > 0) || !isFinite(halfFieldDeg)) return none("invalid-state");',
      "no-half-field",
    );
    // The setup: the drawer's request, its stop, the MTF's beam model, the lattice's size and the mirror.
    assertSource(
      vignetting,
      'if (!(request.aperture.stopSemiDiameterMm > 0) || L.N < 1) return none("invalid-state");',
      "no-stop",
    );
    assertSource(
      vignetting,
      'if (!mtfSequentialRefractivePath(state)) return none("unsupported-path");',
      "lv-outside-beam-model",
    );
    assertSource(
      vignetting,
      'if (!mtfAxialImagePlane(state)) return none("tilted-image-plane");',
      "lv-outside-beam-model",
    );
    assertSource(
      vignetting,
      'fractions.some( (fraction) => launchSurfaceForFieldDeg(fraction * halfFieldDeg, state.lens.projection.config) !== "object-plane", ) ) return none("bounding-sphere-field");',
      "lv-bounding-sphere-field",
    );
    assertSource(vignetting, "export const BEAM_GRID_CELLS = 64;", "vignettingBeamCells, bound");
    assertSource(
      vignetting,
      "return latticeSize(override !== undefined ? override : BEAM_GRID_CELLS);",
      "the sets' cells: BEAM_GRID_CELLS with no count of the drawer's",
    );
    assertSource(vignetting, "return Math.max(Math.round(cellsAcross), MIN_BEAM_GRID_CELLS);", setup);
    assertSource(vignetting, "const mirrored = mirrorSymmetricAboutMeridian(state);", setup);
    assertSource(
      "src/optics/analysis/mtf/mtfTracing.ts",
      "export function mtfMirrorSymmetric(state: PreparedGeometry): boolean { return mirrorSymmetricAboutMeridian(state); }",
      "lvVignettingSetup asks mtfMirrorSymmetric, which hands mirrorSymmetricAboutMeridian on",
    );
    // A field: its geometry, its aimed stop lattice (the MTF's, at the authored indices), none of a bounding sphere.
    assertSource(vignetting, "const geometry = computeOffAxisFieldGeometry(state, fieldFraction, fields);", lattices);
    assertSource(vignetting, "const fieldAngleDeg = fieldFraction * fields.halfFieldDeg;", fields);
    assertSource(
      vignetting,
      "const scalar = geometry && !isOffAxisVectorFieldGeometry(geometry) ? geometry : null;",
      lattices,
    );
    assertSource(vignetting, "const launch = scalar && prepareAimedStopLattice(request, n, scalar);", lattices);
    assertSource(
      vignetting,
      'if (!scalar || !launch) return unavailableField(base, "no-field-launch");',
      "no-field-launch",
    );
    assertSource(vignetting, "const tracer = prepareAimedPupilTrace(state, launch);", lattices);
    // The cells the tab traces: the +x half where it mirrors; an aimed ray only, at the lattice's clip radius.
    assertSource(vignetting, "if (mirrored && cell.xFraction < 0) continue;", "lvBeamLattice's first column");
    assertSource("src/optics/analysis/pupils/stopLattice.ts", "const xFraction = (2 * column + 1 - n) / n;", lattices);
    assertSource(vignetting, 'if (ray.status !== "aimed") return dark;', lattices);
    assertSource(
      vignetting,
      "const outcome = traceRayClassification(result, state, launch.clipSemiDiameterMm);",
      "test/integration/lv/vignettingRays.test.ts classifies a ray so",
    );
    assertSource(
      vignetting,
      "bulkTransmission: bulkTransmissionForTrace(state.lens, result.hits),",
      "the beam sets weigh each cell by LensVisualizer's bulk transmission",
    );
  },
);

test("the vignetting tab still presents the curve the engine answers vignetting.native from", { skip }, () => {
  const vignetting = "src/optics/analysis/vignetting/vignetting.ts";
  const answer = "answerLvVignetting in src/engines/lv/vignetting.ts writes down the tab's curve";
  // The figures: the share of the samples neither unaimed nor failed that get through, absolute; Rimmer's relative
  // illumination over the axis's; a field without either, with its reason.
  assertSource(
    vignetting,
    "const unvignettedFraction = transmittedCount / (lattice.length - unaimedCount - failedCount);",
    "test/integration/lv/vignettingRays.test.ts restates the fraction",
  );
  assertSource(vignetting, "relativeIllumination = field.rimmerSum / axisSum;", answer);
  assertSource(vignetting, "unvignettedFraction: field.unvignettedFraction, relativeIllumination,", answer);
  assertSource(vignetting, "unavailableReason: field.unavailableReason, relativeIlluminationReason,", answer);
  // The tab asks the curve of the drawer's request, or of one of its own with no sampling of the drawer's.
  const tab = "src/components/display/analysis/VignettingTab.tsx";
  assertSource(
    tab,
    "analysisContext?.request ?? createAnalysisRequest({ preparedState, dynamicEFL: 0, currentEPSD, currentPhysStopSD, fieldGeometry, }),",
    "lvChiefRequest in src/engines/lv/chiefSetup.ts is the drawer's request, settled, with every family default",
  );
  assertSource(
    tab,
    'const curve = useMemo(() => probe("computeVignettingCurve", () => context.computeVignettingCurve()), [context]);',
    answer,
  );
  // The landing that identifies a field: LensVisualizer's solved chief ray of the field, to the design plane.
  const height = "src/optics/field/imageHeight.ts";
  const landing = "chiefRayImageHeightAccurateForRuntimeLens identifies each field of lv's answer";
  assertSource(height, "imagePlaneTransfer: lastThicknessAtState(state),", landing);
  assertSource(height, "const solve = solveChiefRay(state, { fieldAngleDeg, geometry });", landing);
  assertSource(
    height,
    ": prepareRayTraceForState(stateWithZ(state, zPos), { ghost: true }).ray(solve.yLaunch, launch.uField);",
    landing,
  );
  assertSource(height, "return trace.y + trace.u * imagePlaneTransfer;", landing);
});

// Stage 6.7, at LV 098c91ef6 (closure fef2e248, with the stage's names): the summary tab's request and readouts and the
// aperture control's effective f-number (src/engines/lv/summary.ts) restate these lines; test/integration/lv/summary.test.ts
// holds the tab's readouts to lv's R1 answer and to the case, and lv's summary.native to the tab.
test(
  "the summary tab still presents the drawer's request as the engine answers summary.native from it",
  { skip },
  () => {
    const hook = "src/components/hooks/useLensComputation.ts";
    const request =
      "lvSummaryRequest in src/engines/lv/summary.ts restates the hook's focal length and the drawer's request";
    // The hook's focal length of the state: computeFocusEFL of a request of its prepared state, which reads nothing else.
    assertSource(
      hook,
      "const dynamicEFL = useMemo(() => (firstOrderRequest ? computeFocusEFL(firstOrderRequest) : 0), [firstOrderRequest]);",
      request,
    );
    assertSource(
      hook,
      "createAnalysisRequest({ preparedState, dynamicEFL: L.EFL, currentEPSD: L.EP.epSD, currentPhysStopSD: L.stopPhysSD, })",
      request,
    );
    assertSource(
      "src/optics/analysis/summary/breathing.ts",
      "return eflAtPreparedState(request.preparedGeometry);",
      request,
    );
    // The drawer hands the tab its request, with the hook's focal length; the tab computes its summary of that request.
    const drawer = "src/components/layout/lensDiagram/AnalysisDrawerContent.tsx";
    assertSource(drawer, "dynamicEFL: analysisInputs.dynamicEFL,", request);
    const renderers = "src/components/layout/lensDiagram/analysisTabRenderers.tsx";
    assertSource(renderers, "summary: ({ L, t, preparedState, analysisContext, inputs }) => (", request);
    const tab = "src/components/display/analysis/OpticalSummaryTab.tsx";
    assertSource(tab, "analysisContext?.request ??", request);
    assertSource(tab, "const summary = useMemo(() => context.computeOpticalSummary(), [context]);", request);
    assertSource(
      "src/optics/analysis/analysisContext.ts",
      '(opticalSummary ??= computeSection("summary", () => analysisJobs.computeOpticalSummary(request))),',
      request,
    );
    assertSource(
      "src/optics/analysis/analysisJobs.ts",
      "computeOpticalSummary(request: AnalysisRequest) { return computeOpticalSummary(request); },",
      request,
    );
    // The readouts the answer writes down, under the labels the tab gives them.
    const answer = "answerLvSummary in src/engines/lv/summary.ts maps each readout to a value of the contract";
    assertSource(tab, '<AnalysisMetricRow label="Current EFL" value={formatMm(summary.currentEFLMm)} t={t} />', answer);
    // Since #933 the tab presents OpticStudio's three f-numbers under their names, and the marked one beside them.
    assertSource(
      tab,
      '<AnalysisMetricRow label="Image-space f/#" value={formatFNumber(summary.imageSpaceFNumber)} t={t} />',
      answer,
    );
    assertSource(
      tab,
      `<AnalysisMetricRow
         label="Paraxial working f/#"
         value={formatFNumber(summary.paraxialWorkingFNumber)}`,
      answer,
    );
    assertSource(
      tab,
      `<AnalysisMetricRow
         label="Working f/#"
         value={formatWorkingFNumber(summary.workingFNumber)}`,
      answer,
    );
    assertSource(
      tab,
      `case "traced":
         return formatFNumber(working.value);`,
      "answerLvSummary states workingFNumber only of a traced marginal ray, and null of its other states",
    );
    assertSource(
      tab,
      '<AnalysisMetricRow label="Entrance pupil" value={formatMm(summary.entrancePupilDiameterMm)} t={t} />',
      answer,
    );
    assertSource(
      tab,
      '<AnalysisMetricRow label="Physical stop" value={formatMm(summary.physicalStopDiameterMm)} t={t} />',
      answer,
    );
    assertSource(tab, '<AnalysisMetricRow label="Half field" value={formatDeg(summary.halfFieldDeg)} t={t} />', answer);
    assertSource(tab, '<AnalysisMetricRow label="Total track" value={formatMm(summary.totalTrackMm)} t={t} />', answer);
    assertSource(tab, '<AnalysisMetricRow label="BFD" value={formatMm(summary.bfdMm)} t={t} />', answer);
    // What the three are (read at 607ff23ae, LV #933): EFL / EPD, both paraxial; 1 / (2 n' |u'|) of the paraxial
    // marginal ray; 1 / (2 n' sin θ') of the real marginal ray aimed at the stop rim; the last two at the paraxial
    // object distance the image plane is conjugate to, which is the case's only at infinity focus.
    const summary = "src/optics/analysis/summary/summary.ts";
    const definitions = "answerLvSummary in src/engines/lv/summary.ts states each under the contract's definition";
    assertSource(
      summary,
      "const entrancePupilDiameterMm = currentEPSD > 0 ? finiteOrNull(currentEPSD * 2) : null;",
      definitions,
    );
    assertSource(summary, ": imageSpaceFNumber(state, currentPhysStopSD);", definitions);
    assertSource(summary, "paraxialWorkingFNumber: paraxialWorkingFNumber(state, currentPhysStopSD),", definitions);
    assertSource(summary, "workingFNumber: computeWorkingFNumber(request),", definitions);
    const fNumber = "src/optics/first-order/fNumber.ts";
    assertSource(
      fNumber,
      "return finitePositive(Math.abs(stopRatio / image.u) / (2 * stopSemiDiameterMm));",
      definitions,
    );
    assertSource(
      fNumber,
      `const vergence = paraxialObjectVergence(state);
       const atStop = traceParaxialSurfaces(state.surfaces, 1, vergence, { stopAt: state.lens.stop.surfaceIndex }).y;
       const image = traceParaxialSurfaces(state.surfaces, 1, vergence, { skipLastTransfer: true });
       const marginalSlope = (stopSemiDiameterMm / Math.abs(atStop)) * Math.abs(image.u);
       return finitePositive(1 / (2 * image.n * marginalSlope));`,
      definitions,
    );
    assertSource(
      "src/optics/field/geometry.ts",
      "if (state.focusT < FOCUS_INFINITY_CUTOFF || state.lens.flags.isFoldedOptics) return 0;",
      "workingFNumbers takes LensVisualizer's object for the case's only at infinity focus, where both are infinite",
    );
    const working = "src/optics/analysis/summary/fNumbers.ts";
    assertSource(
      working,
      "const launch = prepareAimedPupilLaunch(request, [{ xFraction: 0, yFraction: 1 }], field);",
      definitions,
    );
    assertSource(
      working,
      `const sine = sineToNormal(trace.terminalDirection, state.imagePlane.normal);
       const value = 1 / (2 * trace.finalMedium * sine);`,
      definitions,
    );
    assertSource(summary, "const cardinals = computeCardinalElements(request);", answer);
    assertSource(
      "src/optics/analysis/summary/cardinals.ts",
      ": computeCardinalElementsFromState(request.preparedGeometry);",
      "rearFocalZ is computeCardinalElementsFromState's rear focal point, the construction of the tab's BFD",
    );
    assertSource(summary, "focusDistanceM: focusDistanceAt(state.focusT, L, state.zoomT),", answer);
    // The hook's pupil since #933: the stop radius over the paraxial marginal ray's height ratio at the stop.
    const pupil = "the tab's entrance pupil, held to lv's R1 radius in test/integration/lv/summary.test.ts";
    assertSource(
      "src/optics/field/geometry.ts",
      "const epSD = Math.abs(pupilRatio) > 1e-9 ? Math.abs(stopSD / pupilRatio) : 0;",
      pupil,
    );
    // The half field: the hook's analysis field geometry, the field whose solved chief ray lands at the image corner.
    const field =
      "NOT_COVERED_BY_R1 in test/integration/lv/summary.test.ts and docs/gotchas.md describe the half field";
    assertSource(
      "src/optics/state/fieldAdapters.ts",
      "return computeAnalysisFieldGeometry(prepareState(compiledLensFromRuntime(L), focusT, zoomT, aberrationT));",
      field,
    );
    const imageHeight = "src/optics/field/imageHeight.ts";
    assertSource(
      imageHeight,
      "const maxImageHeight = (state.lens.source?.catalog.imageCircleMm ?? format.diagonalMm) / 2;",
      field,
    );
    assertSource(imageHeight, "if (limit?.settled) return { ...geometry, halfFieldDeg: limit.fieldDeg };", field);
    assertSource(
      imageHeight,
      "if (Math.abs(fMid) < ANALYSIS_FIELD_CORNER_TOLERANCE_MM) return { fieldDeg: mid, settled: true };",
      field,
    );
    assertSource(imageHeight, "rectilinearProjectionMaxTraceField(state.lens.projection.config) === undefined;", field);
  },
);

test(
  "the aperture control still marks the slider's f-number and shows the paraxial working one beside it",
  { skip },
  () => {
    // Read at 607ff23ae (LV #933): the thin-lens "eff. f/" is gone; beside the mark the control shows the paraxial
    // working f-number, which the summary tab also presents.
    const hook = "src/components/hooks/useLensComputation.ts";
    const control =
      "answerLvSummary in src/engines/lv/summary.ts records the control's marked f-number (lvNominalFNumber)";
    assertSource(hook, "const fNumber = L ? fNumberAtStopdown(stopdownT, zoomT, L) : 1;", control);
    assertSource(
      hook,
      "? paraxialWorkingFNumberForRuntimeLens(currentPhysStopSD, focusT, zoomT, L, aberrationT)",
      "the control's paraxial working f-number is the summary tab's, which answerLvSummary states",
    );
    const controls = "src/components/controls/DiagramControls.tsx";
    assertSource(controls, "displayValue={`f/${formatFNumber(fNumber)}${paraxialWorkingNote}`}", control);
    assertSource(
      controls,
      "showEffectiveAperture && showsParaxialWorkingFNumber(paraxialWorkingFNum, fNumber)",
      "NOT_COVERED_BY_R1 says the control shows the paraxial working f-number only above a difference from the mark",
    );
    assertSource(
      "src/optics/first-order/format.ts",
      "const PARAXIAL_WORKING_NOTE_DIFFERENCE = 0.05;",
      "NOT_COVERED_BY_R1 names the difference",
    );
    // The marked f-number sizes the stop by the paraxial rule, with the exceptions a lens declares (stopRule).
    const nominal = "the owner's brief: LensVisualizer's marked f-number now sizes its stop by the paraxial EPD = F/N";
    const constants = "src/optics/first-order/lensConstants.ts";
    assertSource(
      constants,
      `const stopRule: ApertureStopRule = data.zoomStopSemiDiameters
       ? "schedule"
       : preserveAuthoredStopSD
         ? "authored"
         : isZoom && data.zoomApertureModel === "fixed-iris"
           ? "fixed-iris"
           : "f-number";
     if (stopRule === "schedule") S[stopIdx].sd = data.zoomStopSemiDiameters![0];
     else if (stopRule !== "authored") S[stopIdx].sd = fNumberRuleStop(lens, baseNomFno, 0);`,
      nominal,
    );
    assertSource(
      constants,
      "const apertureReferenceFocalLength = fisheyeProjectionFocalLengthAtZoom(projection, 0) ?? nomEFL;",
      nominal,
    );
  },
);

// ── Stage 6.8b: LensVisualizer #928, #932 and #936 ───────────────────────────────────────────────────────────────

test(
  "a flat rim cut is still only a clear radius of the trace, the land a drawing and no surface of it",
  { skip },
  () => {
    // Read at 607ff23ae (LV #928, #932): LV traces the uncut cap and clips a ray beyond the cut radius.
    const mirror =
      "lvClearRadius in src/engines/lv/exportAperture.ts restates clearSemiDiameter; surfaceAperture exports the cap " +
      "clipped at that radius";
    assertSource(
      "src/optics/geometry/rimCut.ts",
      `export function clearSemiDiameter(sd: number, cut: RimCut | null): number {
       return cut ? Math.min(sd, cut.radius) : sd;
     }`,
      mirror,
    );
    assertSource(
      "src/optics/trace/aperture.ts",
      `if (typeof surface.sd !== "number" || !surface.clips) return null;
     return clearSemiDiameter(surface.sd, surface.rimCut);`,
      mirror,
    );
    // The land is met by no trace: only the drawing of a clipped hit is moved onto it.
    assertSource(
      "src/optics/trace/runtimeRayResult.ts",
      `const land = rimCutLandPoint(L.surfaces[hit.surfaceIndex], hit);
     if (ghost) ghostPts.push(land ? [land[2], land[1]] : point);`,
      "exportAperture.ts says no ray of a trace meets the land; a change here would make the land a surface",
    );
    assert.equal(
      occurrences("src/optics/trace/sequentialTrace.ts", "rimCut"),
      0,
      "the sequential tracer now reads a rim cut: the land may be a surface of the trace, which the contract cannot express",
    );
    // The validator holds the cap beyond the land from the cut radius out to sd, which makes the two models one.
    assertSource(
      "src/optics/prescription/validate/geometry.ts",
      "const reentry = rimCutReentryRadius(sag, s.sd, cut);",
      "exportAperture.ts relies on it: a forward ray that would meet the land first meets the uncut cap beyond the cut first",
    );
    assertSource(
      "src/optics/prescription/surfaces.ts",
      "rimCut: compileRimCut(surface, profile),",
      "the binding reads the prepared surface's rimCut, which LvSurface types",
    );
  },
);

test(
  "the MTF still traces its stop lattice as the ray sets hold it: every aimed cell, of one weight each",
  { skip },
  () => {
    // Read at 607ff23ae (LV #936). lvFieldRays keeps the rays of aimMtfStopLattice verbatim, in the set's square
    // lattice of cellsAcross cells, a vacant cell (outside the disc, or unaimed) the chief ray at weight 0.
    const tracing = "src/optics/analysis/mtf/mtfTracing.ts";
    const mirror = "lvFieldRays in src/engines/lv/raySets.ts";
    assertSource(
      tracing,
      'const chief: Ray3 = lattice.chief.status === "aimed" ? lattice.chief : mtfLaunchRay(launch, 0, 0);',
      `${mirror} takes the line's aimed stop-centre ray for the chief, or the field's chief where it has none`,
    );
    assertSource(
      tracing,
      `if (ray.status === "unaimed") {
       bundle.unaimed += samples;`,
      `${mirror} gives an unaimed cell no ray of its own, as LensVisualizer traces none`,
    );
    assertSource(
      tracing,
      "const ray0: MtfPupilRay = { ...point, column: cell.column, row: cell.row, trace: record };",
      `${mirror} weighs a cell 1, which lvRayWeights multiplies by the bulk transmission of mtfImagePoint`,
    );
    assertSource(
      tracing,
      "stepMm: (2 * lattice.stopSemiDiameterMm) / n,",
      `${mirror} states the lattice's step on the stop`,
    );
    assertSource(
      tracing,
      "const mirror = mtfMirrorSymmetric(state) && n % 2 === 0;",
      `${mirror} holds both halves, which the aimed lattice states exactly, where the bundle traces one`,
    );
    // The rim rule: the bundle checks the stop at the lattice's clip radius; lv traces the case's own stop radius,
    // as every engine does, which no aimed cell's centre comes near (see docs/REFERENCE.md, Stage 6.8b).
    assertSource(
      tracing,
      `stopSemiDiameter: lattice.clipSemiDiameterMm,
     launchBoundT: lattice.launchBoundT,`,
      "R4f's replay calls traceMtfStopBundle for it; the ray sets are traced at the case's stop radius",
    );
    const lattice = "src/optics/analysis/pupils/stopLattice.ts";
    assertSource(
      lattice,
      `const yFraction = (2 * row + 1 - n) / n;
     for (let column = 0; column < n; column++) {
       const xFraction = (2 * column + 1 - n) / n;
       if (xFraction * xFraction + yFraction * yFraction <= 1) cells.push({ row, column, xFraction, yFraction });`,
      `${mirror} places each cell's ray at row * cellsAcross + column of its set`,
    );
    const aimed = "src/optics/analysis/pupils/aimedPupil.ts";
    assertSource(
      aimed,
      `if (solve.status === "blocked" && solve.blocked) {
       const ray = frame.ray(solve.blocked.launch[0], solve.blocked.launch[1]);`,
      `${mirror} keeps a blocked cell's blocking ray, which every engine stops ahead of the stop`,
    );
    assertSource(
      aimed,
      `const { uField, yChief } = geometry;
     // The skew adapters' launch: coordinates on the first-vertex plane, origin stepped back by the lead.
     const lead = state.lens.constants.rayLead ?? 0;`,
      `${mirror} holds the origins in front of the first surface (launch-behind-first-surface otherwise)`,
    );
  },
);

test(
  "a finite object's aimed launch seeds its chief at the solved chief, on the straight line to the stop centre only without it",
  { skip },
  () => {
    // Read at 607ff23ae, where the seed was the straight line alone: where it reached no stop, the field model had no
    // chief crossing and every sample was unaimed (47 fields of 18 focus stations), which lvFieldRays makes no set of
    // (lv-field-unaimed). Read again at 6287f4393 (LV #940): prepareMtfFieldLaunch hands the aim the chief it solved,
    // and no MTF field of the 67 documented focus stations is then left with no aimed cell. When these lines change,
    // run the focus-stations suite again (docs/gotchas.md, "A finite object's stop lattice that LensVisualizer aims no
    // cell of"; docs/upstream/lensvisualizer-finite-object-aim.md).
    const why =
      "lvFieldRays's lv-field-unaimed, met on no focus station since LV #940, whose history docs/gotchas.md describes";
    const aimed = "src/optics/analysis/pupils/aimedPupil.ts";
    assertSource(
      "src/optics/analysis/mtf/mtfTracing.ts",
      `return {
         ...launch,
         centerY: aim.root,
         aim: { kind: "finite-object", objectPoint, leadZ, chiefLaunch: [0, aim.root] },
       };`,
      `${why}: the aimed launch is handed the solved chief (LvAimedFieldGeometry's chiefLaunch in types.ts)`,
    );
    assertSource(
      aimed,
      "readonly chiefLaunch?: readonly [number, number];",
      "LvAimedFieldGeometry in src/engines/lv/types.ts states it so",
    );
    assertSource(aimed, "const { objectPoint, leadZ, chiefLaunch } = geometry;", why);
    assertSource(aimed, "const seedFraction = (stopZ - leadZ) / (stopZ - objectPoint[2]);", why);
    assertSource(
      aimed,
      "chief: axial ? [0, 0] : (chiefLaunch ?? [objectPoint[0] * seedFraction, objectPoint[1] * seedFraction]),",
      why,
    );
    assertSource(aimed, "chiefStop: stopAt(frame.chief),", why);
    assertSource(
      aimed,
      'return { status: "unaimed", reason: "trace-failed", launch: model.chief, stop: null, iterations: 0 };',
      why,
    );
    assertSource(
      aimed,
      'return join("f", [...geometry.objectPoint, geometry.leadZ, ...(geometry.chiefLaunch ?? [])]);',
      `${why}: two fields of one object point and another chief are aimed apart`,
    );
  },
);
