// Source canaries: the lines of LensVisualizer's own source that the exporter and the engine `lv` mirror or rely on,
// pinned as text at LV commit d36f44b3, those of the MTF tab's request at ed78cf40, those of the geometric OTF's
// conventions at c05a2ab7 and those of the MTF's refinement, which the replay restates, at 33ebdb30.
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
  // The seed of the footprint scan is the pupil radius of the request, which the ray sets take from the hook's rule
  // (the canary of the hook is below).
  assertSource(
    "src/optics/analysis/mtfTracing.ts",
    `options.stopSemiDiameterMm,
       ),
     options.pupilSemiDiameterMm,
     mtfMirrorSymmetric(state),
     growths,
   );`,
    "lvLaunchSetup in src/engines/lv/raySets.ts seeds the footprint scan with lvPupilSeed, as pupilSemiDiameterMm",
  );
});

// ── The MTF tab's request ────────────────────────────────────────────────────────────────────────────────────────
//
// What LensVisualizer presents as a lens's MTF is what its MTF tab asks its engine for. The tab and the hook that
// feeds it are React code, which cannot be imported: src/engines/lv/tabRequest.ts restates them, and the lines
// below are the ones it restates, pinned at LV commit ed78cf40.

test("the hook still hands the MTF tab the stop and the pupil radius by the expressions lv restates", { skip }, () => {
  const hook = "src/components/hooks/useLensComputation.ts";
  const mirror = "lvHookAperture in src/engines/lv/tabRequest.ts restates it, in this order of operations";
  assertSource(hook, "const currentFOPEN = L ? fopenAtZoom(zoomT, L) : 1;", mirror);
  assertSource(hook, "const fNumber = L ? fNumberAtStopdown(stopdownT, zoomT, L) : 1;", mirror);
  assertSource(hook, "const wideOpenStopSD = L ? wideOpenStopAtZoom(zoomT, L) : 0;", mirror);
  assertSource(hook, "const currentPhysStopSD = L ? (wideOpenStopSD * currentFOPEN) / fNumber : 0;", mirror);
  assertSource(
    hook,
    `const baseEPSD =
       L && fieldGeometry ? entrancePupilAtState(wideOpenStopSD, focusT, zoomT, L, fieldGeometry, aberrationT).epSD : 0;`,
    mirror,
  );
  assertSource(hook, "const currentEPSD = L ? (baseEPSD * currentFOPEN) / fNumber : 0;", mirror);
  assertSource(
    hook,
    `const fieldGeometry = useMemo(
       () => (L ? computeAnalysisFieldGeometryAtState(focusT, zoomT, L, aberrationT) : null),`,
    "lvHookAperture hands entrancePupilAtState2 the analysis field geometry, as the hook does",
  );
  // A lens opens with its aperture slider at 0 and its aberration control neutral.
  assertSource(
    hook,
    "aberrationT: requestedAberrationT = 0,",
    "lvHookAperture takes the aberration control as neutral",
  );
  assertSource(
    "src/optics/aperture.ts",
    "const requested = L.FOPEN * Math.pow(L.maxFstop / L.FOPEN, stopdownT);",
    "lvHookAperture asks fNumberAtStopdown at the slider position 0, which is wide open",
  );
  // The hook's functions are the ones the binding imports under their names with a 2.
  const barrel = "src/optics/optics.ts";
  const imported = "the binding takes the function of this name with a 2 for the one the hook calls";
  assertSource(barrel, "fopenAtZoom2 as fopenAtZoom,", imported);
  assertSource(barrel, "entrancePupilAtState2 as entrancePupilAtState,", imported);
  assertSource(barrel, "computeAnalysisFieldGeometryAtState2 as computeAnalysisFieldGeometryAtState,", imported);
  // The pupil radius the hook derives follows the stop radius through the geometry's pupil ratio alone.
  assertSource(
    "src/optics/field/chiefRay.ts",
    "const epSD = Math.abs(geom.yRatio) > 1e-9 ? Math.abs(stopSD / geom.yRatio) : 0;",
    "lvHookAperture takes the entrance pupil of the wide-open iris for the pupil the tab scales",
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
      `const options: MtfOptions = useMemo(
       () => ({
         method: preferences.method,
         spectrum: spectrum.spectrum,
         focus: preferences.focus,
         maxGridSize: preferences.maxGridSize,
         fieldFractions: mtfFieldFractions(preferences.fieldStepPercent),
         pupilSemiDiameterMm: currentEPSD,
         stopSemiDiameterMm: currentPhysStopSD,
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
    assertSource(tab, "const { focusT, zoomT, aberrationT } = preparedState;", mirror);
    assertSource(tab, "() => (support.available ? { focusT, zoomT, aberrationT, options } : null),", mirror);
    assertSource(tab, "const { result, stale, running, error } = useMtfComputation(L, job);", mirror);
    assert.equal(occurrences(tab, "frequenciesPerMm"), 0, `${tab} now names the frequencies of its request`);
    assert.equal(occurrences(tab, "frequencies={preferences.frequencies}"), 2, `${tab} draws other frequencies`);
  },
);

test(
  "the tab's f/8 comparison still scales both radii by N over 8, for a lens that is faster and reaches f/8",
  { skip },
  () => {
    const tab = "src/components/display/analysis/MtfTab.tsx";
    const mirror = 'lvTabRequest in src/engines/lv/tabRequest.ts restates it for the view "f8-comparison"';
    assertSource(tab, "const COMPARISON_F_NUMBER = 8;", "LV_TAB_COMPARISON_F_NUMBER in tabRequest.ts is this number");
    assertSource(
      tab,
      "const compareF8Available = !!fNumber && fNumber < COMPARISON_F_NUMBER - 0.05 && L.maxFstop >= COMPARISON_F_NUMBER;",
      mirror,
    );
    assertSource(
      tab,
      `const scale = fNumber / COMPARISON_F_NUMBER;
     const stopped = {
       ...job.options,
       pupilSemiDiameterMm: job.options.pupilSemiDiameterMm * scale,
       stopSemiDiameterMm: job.options.stopSemiDiameterMm * scale,
     };`,
      mirror,
    );
  },
);

test("the tab's defaults are still the ones the profile lv-tab-default is documented and pinned with", { skip }, () => {
  // The profile reads LensVisualizer's defaults when it runs, so a change here changes no code of the comparator:
  // it changes what the profile is. README.md, contract/CONTRACT.md and the figures pinned in
  // test/integration/lv/mtf.test.ts describe these.
  assertSource(
    "src/utils/state/mtfPreferences.ts",
    `export const DEFAULT_MTF_PREFERENCES: MtfPreferences = Object.freeze({
       method: "diffraction",
       spectrum: "photopic",
       focus: "best-axial",
       view: "field",
       fieldStepPercent: 10,
       frequencies: Object.freeze([10, 30] as const),
       maxGridSize: 128,
       compareF8: false,
     });`,
    "the profile lv-tab-default follows it at run time; its documented defaults and pinned figures are of these",
  );
  assertSource(
    "src/optics/analysis/mtfConstants.ts",
    "export const MTF_FREQUENCIES: readonly number[] = Object.freeze(Array.from({ length: 51 }, (_, i) => i * 2));",
    "the frequencies of the profile are documented as 0 to 100 cycles/mm in steps of 2",
  );
});

test("the grid caps, the names and the limits of a request are still as lv states, maps or asks them", { skip }, () => {
  const constants = "src/optics/analysis/mtfConstants.ts";
  assertSource(
    constants,
    "export const MTF_GRID_CAPS: readonly MtfGridCap[] = Object.freeze([32, 64, 128, 256]);",
    "LV_GRID_CAPS in src/engines/lv/mtf.ts is this list: a cap of the option lvGridCap is held to it",
  );
  assertSource(
    constants,
    "export const MTF_DEFAULT_GRID_CAP: MtfGridCap = 128;",
    "LV_DEFAULT_GRID_CAP in src/engines/lv/mtf.ts is this number: the cap of a request without a profile",
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
  // The limits on the fields and frequencies of one request are not restated: lv asks the gate, which must still
  // answer for them with the reason lv reads as a refusal of what was added to a request it had passed.
  const gate = "src/optics/analysis/mtfSupport.ts";
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
    assertSource(worker, "steps: computeMtfSteps(state, options, jobCache(message.job)),", mirror);
    // The worker builds the lens again from the authored surfaces, as the catalog's lens file is built.
    assertSource(
      worker,
      `lens = buildLens({
       ...message.data,
       surfaces: message.data.surfaces.filter((surface) => !surface.synthetic),
       elements: message.data.elements.filter((element) => !element.synthetic),
     });`,
      "lv builds the lens of the catalog, which an integration test holds to this rebuilt one",
    );
    const engine = "src/optics/analysis/mtf.ts";
    assertSource(
      engine,
      `export function computeMtf(state: PreparedOpticalState, options: MtfOptions): MtfResult {
       const steps = computeMtfSteps(state, options);
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
    const math = "src/optics/analysis/mtfMath.ts";
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
    const mtf = "src/optics/analysis/mtf.ts";
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
    const wave = "src/optics/analysis/mtfWavefront.ts";
    const sheared = "src/optics/analysis/mtfShearedOtf.ts";
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
    // Read at 33ebdb30 (engine closure 78215d72).
    const mtf = "src/optics/analysis/mtf.ts";
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

    const field = "replayField in src/engines/lv/replay.ts restates traceField, line by line";
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
       let footprint = findMtfFieldFootprint(state, options, support, launch);
       if (!footprint) {
         yield markUnavailable(
           emptyMtfField(target.fraction, target),
           "vignetted",
           "No rays reach this image height through the model's clear apertures.",
         );
         return;
       }
       let expansions = 0;
       const evaluate = (size: number): MtfGridOutcome => {
         for (;;) {
           const outcome = fieldAtGrid(context, target, launch, footprint!, size);
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
    // best field after every size, ends at a converged one, and goes on after a failure a finer grid may mend.
    assertSource(
      mtf,
      `for (const size of ladder) {
         const outcome = evaluate(size);
         if (outcome.kind === "unavailable") {
           const best = previous ?? outcome.field;
           yield best;
           if (outcome.refine) continue;
           return;
         }
         applyConvergence(outcome.field, previous, frequencies);
         yield outcome.field;
         if (outcome.field.status === "converged") return;
         previous = outcome.field;
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
  // Read at 33ebdb30 (engine closure 78215d72).
  const mtf = "src/optics/analysis/mtf.ts";
  const mirror = "fieldAtGrid in src/engines/lv/replay.ts restates the bookkeeping, line by line and in this order";
  assertSource(
    mtf,
    `const field = emptyMtfField(target.fraction, target);
     field.gridSize = size;
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
    `let launchedWeight = 0;
     let failedWeight = 0;
     for (const line of support.spectralLines) {
       const bundle = traceMtfBundle(state, options, support, launch, footprint, size, line, context.imagePlaneZ, {
         reference: commonReference,
       });
       if (!bundle) return unavailable("chief-ray-failed", "No valid chief ray reaches the image plane.");
       chiefClipped ??= bundle.chiefClipped;
       commonReference ??= bundle.chief;
       field.imageHeightMm = Math.hypot(commonReference.x, commonReference.y);
       field.validRays += bundle.rays.length;
       field.blockedRays += bundle.blocked;
       field.failedRays += bundle.failed;
       openBorders.x ||= bundle.openBorders.x;
       openBorders.y0 ||= bundle.openBorders.y0;
       openBorders.y1 ||= bundle.openBorders.y1;
       const transmitted = bundle.rays.reduce((sum, ray) => sum + ray.weight, 0);
       launchedWeight += transmitted + bundle.failedWeight;
       failedWeight += bundle.failedWeight;`,
    mirror,
  );
  assertSource(
    mtf,
    `if (bundle.rays.length < MTF_MIN_RAYS || !(transmitted > 0))
       return unavailable("empty-pupil", "Too little pupil remains to estimate MTF.", true);`,
    mirror,
  );
  assertSource(
    mtf,
    `field.unknownFluxFraction = launchedWeight > 0 ? failedWeight / launchedWeight : 0;
     const unresolved = assessUnresolvedFlux(field.failedRays, field.unknownFluxFraction);
     if (!unresolved.acceptable) return unavailable("trace-failed", "Numerical ray failures prevent an MTF estimate.");
     if (unresolved.note) field.notes.push(unresolved.note);`,
    mirror,
  );
  assertSource(mtf, 'return { kind: "curves", field, openBorders };', mirror);
  // The reference a later line is handed stands in only where that line's own chief ray has no image point; the
  // bundle states the point it used as its chief, and which sides of the footprint carried flux.
  const tracing = "src/optics/analysis/mtfTracing.ts";
  const bundle = "the replay reads the reference, the open borders and the unresolved flux off traceMtfBundle's bundle";
  assertSource(
    tracing,
    "const chiefPoint = mtfImagePoint(state, chiefTrace, imagePlaneZ) ?? extras.reference;",
    bundle,
  );
  assertSource(tracing, "extras: { reference?: MtfSpot; opticalPath?: boolean } = {},", bundle);
  assertSource(
    tracing,
    `if (Math.abs(x) > footprint.x1 - footprint.guardMm) bundle.openBorders.x = true;
     if (y < footprint.y0 + footprint.guardMm) bundle.openBorders.y0 = true;
     if (y > footprint.y1 - footprint.guardMm) bundle.openBorders.y1 = true;`,
    bundle,
  );
  assertSource(tracing, "bundle.failedWeight += samples * launchWeight;", bundle);
  // The constants the replay is handed are still exported under these names, with the values it was read at.
  const constants = "src/optics/analysis/mtfConstants.ts";
  const named = "LV_IMPORT_MANIFEST in src/engines/lv/manifest.ts imports the constant by this name";
  assertSource(constants, "export const MTF_GRID_LADDER = Object.freeze([16, 32, 64, 128, 256] as const);", named);
  assertSource(constants, "export const MTF_DEFAULT_GRID_CAP: MtfGridCap = 128;", named);
  assertSource(constants, "export const MTF_MAX_FOOTPRINT_EXPANSIONS = 2;", named);
  assertSource(constants, "export const MTF_MIN_RAYS = 16;", named);
  assertSource(
    constants,
    "export const MTF_FIELDS: readonly number[] = Object.freeze([0, 0.25, 0.5, 0.75, 1]);",
    named,
  );
});

test("the tab's f/8 comparison is still the hook's two radii scaled by the slider's f-number over 8", { skip }, () => {
  // Read at 33ebdb30. The run aperture lv-f8-comparison is this stop, and the seed of its footprint scan this pupil.
  const tab = "src/components/display/analysis/MtfTab.tsx";
  const mirror =
    "lvTabComparison in src/engines/lv/tabRequest.ts restates the scale and the tab's rule; stopRadius in " +
    "exportAperture.ts makes the stop of the aperture lv-f8-comparison of it, and lvPupilSeed its seed";
  assertSource(tab, "const scale = fNumber / COMPARISON_F_NUMBER;", mirror);
  assertSource(tab, "stopSemiDiameterMm: job.options.stopSemiDiameterMm * scale,", mirror);
  assertSource(tab, "pupilSemiDiameterMm: job.options.pupilSemiDiameterMm * scale,", mirror);
  assertSource(
    tab,
    "const compareF8Available = !!fNumber && fNumber < COMPARISON_F_NUMBER - 0.05 && L.maxFstop >= COMPARISON_F_NUMBER;",
    mirror,
  );
});
