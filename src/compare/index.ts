// Every comparator there is. A stage that adds a quantity whose results are compared adds its comparator here.
import { createComparatorLookup } from "./comparator.ts";
import type { ComparatorLookup } from "./comparator.ts";
import { mtfFidelityComparator } from "./mtfFidelity.ts";
import { paraxialFirstOrderComparator } from "./paraxialFirstOrder.ts";
import { raysGeometryComparator } from "./raysGeometry.ts";
import { raysPathComparator } from "./raysPath.ts";
import { selftestEchoComparator } from "./selftestEcho.ts";
import { systemDescribeComparator } from "./systemDescribe.ts";

/**
 * The comparators of the comparator's quantities; nothing can be added to them while the program runs. `rays.trace`
 * has two, one for each rung that compares it: its geometry for `r2` and its optical path for `r3`. `mtf.native`
 * has one, for the rung `r4f`: no rung compares it as the engines' own MTF yet.
 */
export const COMPARATORS: ComparatorLookup = createComparatorLookup([
  selftestEchoComparator,
  systemDescribeComparator,
  paraxialFirstOrderComparator,
  raysGeometryComparator,
  raysPathComparator,
  mtfFidelityComparator,
]);
