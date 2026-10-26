// Every comparator there is. A stage that adds a quantity whose results are compared adds its comparator here.
import { createComparatorLookup } from "./comparator.ts";
import type { ComparatorLookup } from "./comparator.ts";
import { mtfFidelityComparator } from "./mtfFidelity.ts";
import { mtfGeometricComparator, mtfNativeComparator } from "./mtfNative.ts";
import { mtfWaveComparator } from "./mtfWave.ts";
import { paraxialFirstOrderComparator } from "./paraxialFirstOrder.ts";
import { raysGeometryComparator } from "./raysGeometry.ts";
import { raysMtfComparator } from "./raysMtf.ts";
import { raysPathComparator } from "./raysPath.ts";
import { raysSpotComparator } from "./raysSpot.ts";
import { raysAxialComparator } from "./raysAxial.ts";
import { raysChiefComparator } from "./raysChief.ts";
import { raysWaveMtfComparator } from "./raysWaveMtf.ts";
import { selftestEchoComparator } from "./selftestEcho.ts";
import { spotNativeComparator } from "./spotNative.ts";
import { axialNativeComparator } from "./axialNative.ts";
import { chiefNativeComparator } from "./chiefNative.ts";
import { systemDescribeComparator } from "./systemDescribe.ts";
import { mtfWavefrontComparator } from "./mtfWavefront.ts";
import { wavefrontNativeComparator } from "./wavefrontNative.ts";

/**
 * The comparators of the comparator's quantities; nothing can be added to them while the program runs. `rays.trace`
 * has seven, one for each rung that compares it: its geometry for `r2`, its optical path for `r3`, the geometric
 * MTF of its landings for `r4`, the wave MTF of its optical paths for `r6a`, the spot and fan of the coma and
 * bokeh tabs' rays for `r7a`, the axial intercepts of the spherical-aberration and axial-colour sections' rays for
 * `r8a` and the landings of the distortion, pupils and lateral-colour tabs' chief rays for `r9a`. `spot.native` has
 * one, for `r7b`, `axial.native` one, for `r8b`, and `chief.native` one, for `r9b`. `mtf.native` has five, for the rungs
 * `r4f`, `r5`, `r5g`, `r6b` and `r6c`; R6c reuses the native comparator and its sorting. `wavefront.native`
 * also has a comparator of raw OPD, restricted to matching grids, points and reference spheres.
 */
export const COMPARATORS: ComparatorLookup = createComparatorLookup([
  selftestEchoComparator,
  systemDescribeComparator,
  paraxialFirstOrderComparator,
  raysGeometryComparator,
  raysPathComparator,
  raysMtfComparator,
  raysWaveMtfComparator,
  raysSpotComparator,
  raysAxialComparator,
  raysChiefComparator,
  mtfFidelityComparator,
  mtfNativeComparator,
  mtfGeometricComparator,
  mtfWaveComparator,
  mtfWavefrontComparator,
  wavefrontNativeComparator,
  spotNativeComparator,
  axialNativeComparator,
  chiefNativeComparator,
]);
