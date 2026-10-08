// Every comparator there is. A stage that adds a quantity whose results are compared adds its comparator here.
import { createComparatorLookup } from "./comparator.ts";
import type { ComparatorLookup } from "./comparator.ts";
import { selftestEchoComparator } from "./selftestEcho.ts";

/** The comparators of the comparator's quantities; nothing can be added to them while the program runs. */
export const COMPARATORS: ComparatorLookup = createComparatorLookup([selftestEchoComparator]);
