// The comparator plug-in: what the comparison knows about one quantity. A quantity's comparator turns the data of
// two "ok" results into the numbers that say how far apart they are; judging those numbers belongs to the policy.
import type { ComparisonMetric } from "../contract/comparison.ts";
import type { JsonObject } from "../contract/json.ts";

/** A metric a comparator reports: its name and the unit of its value. */
export interface MetricDeclaration {
  readonly name: string;
  /** The unit, such as `mm`; `1` for a number without one. */
  readonly unit: string;
}

/** One metric as a comparator computes it. Unlike a stored metric, its value may be a NaN or an infinity. */
export interface ComputedMetric {
  readonly name: string;
  /** The value in IEEE 754 arithmetic: a NaN where the two answers have no difference that is a number. */
  readonly value: number;
  /** Where the value occurs, when it occurs somewhere. */
  readonly where?: ComparisonMetric["where"];
}

/** What a comparator makes of two answers: their metrics, or why they cannot be compared at all. */
export type ComparatorOutcome =
  | { readonly comparable: true; readonly metrics: readonly ComputedMetric[] }
  | { readonly comparable: false; readonly reason: string };

/** The comparison of one quantity. */
export interface QuantityComparator {
  /** The dotted id of the quantity whose data it reads. */
  readonly quantity: string;
  /** Every metric it reports, in the order it reports them. */
  readonly metrics: readonly MetricDeclaration[];
  /**
   * The metrics of two answers. A pure function of the two: equal data gives equal metrics, on any machine, and
   * swapping the two changes no value. Both are data of the quantity, valid by its schema and with arrays that
   * decode; for anything else it may throw. Answers that are valid and still cannot be set against each other
   * (arrays of different shapes) are not comparable, with a reason that quotes nothing but the data.
   */
  compare(a: JsonObject, b: JsonObject): ComparatorOutcome;
  /**
   * What one answer reports beside what is compared, by name: values that are listed with every comparison of the
   * answer and never judged. A comparator has this only when its quantity has such values. The data is as for
   * `compare`; the values are as the answer has them, so one may be a NaN or an infinity.
   */
  recorded?(data: JsonObject): { readonly [name: string]: readonly number[] };
}

/** A set of comparators that can be read but not added to. */
export interface ComparatorLookup {
  /** The comparator of the quantity with this id, or undefined when it has none. */
  get(quantity: string): QuantityComparator | undefined;
  /** Every comparator, sorted by quantity id, in a fresh list. */
  list(): QuantityComparator[];
}

/** A lookup of the given comparators. Throws when two of them are for one quantity. A lookup is by exact id. */
export function createComparatorLookup(comparators: readonly QuantityComparator[]): ComparatorLookup {
  const byQuantity = new Map<string, QuantityComparator>();
  for (const comparator of comparators) {
    if (byQuantity.has(comparator.quantity)) throw new Error(`quantity ${comparator.quantity} has two comparators`);
    byQuantity.set(comparator.quantity, comparator);
  }
  return Object.freeze({
    get: (quantity: string) => byQuantity.get(quantity),
    list: () =>
      [...byQuantity.values()].sort((a, b) => (a.quantity < b.quantity ? -1 : a.quantity > b.quantity ? 1 : 0)),
  });
}
