// Source canaries: the lines of LensVisualizer's own source that the exporter mirrors or relies on, pinned as text
// at LV commit d36f44b3. LensVisualizer exports none of these rules as a function, so the comparator restates them;
// when LV rewrites one, the canary fails and names what to read again. Whitespace is not compared.
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
