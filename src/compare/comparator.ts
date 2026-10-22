// The comparator plug-in: what the comparison knows about one quantity. A quantity's comparator turns the data of
// two "ok" results into the numbers that say how far apart they are; judging those numbers belongs to the policy.
import type { OpticalCase } from "../contract/case.ts";
import type { ComparisonMetric } from "../contract/comparison.ts";
import type { JsonObject } from "../contract/json.ts";
import type { RungPolicy } from "../contract/policy.ts";
import type { MtfRecipe } from "../core/mtfRecipe.ts";

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

/** A metric a comparator declares and could not measure on two answers, and why. */
export interface UnmeasuredMetric {
  readonly name: string;
  /** Why the two answers have nothing to measure it on, in words that quote nothing but the data. */
  readonly reason: string;
}

/**
 * What a comparator makes of two answers: their metrics, or why they cannot be compared at all. A metric that the
 * two answers have nothing to measure on is left out of `metrics` and listed under `unmeasured`: it is then not
 * judged, and the pair's reason says why it is missing.
 */
export type ComparatorOutcome =
  | {
      readonly comparable: true;
      readonly metrics: readonly ComputedMetric[];
      readonly unmeasured?: readonly UnmeasuredMetric[];
      /**
       * What is to be said of the two answers beside their metrics, in words that quote nothing but the data: which
       * part of them was set aside from a figure, and why. Each becomes a part of the pair's reason.
       */
      readonly notes?: readonly string[];
    }
  | { readonly comparable: false; readonly reason: string };

/** A later answer of an engine to the request of a comparison, by the name of its step (`ManifestJob.step`). */
export interface StepAnswer {
  readonly step: string;
  /** The data of the step's "ok" result: valid by the quantity's schema, with arrays that decode. */
  readonly data: JsonObject;
}

/**
 * What two answers are answers to, for a comparator whose metrics need more than the answers: the clip radius of a
 * surface, the wavelength of a line, which ray of a set is the chief ray. A member is left out where the caller
 * does not have it; a comparator that needs it then finds the answers not comparable.
 */
export interface ComparisonContext {
  /** The spec of the request both answers are to. */
  readonly spec?: JsonObject;
  /** The case the request is about. */
  readonly opticalCase?: OpticalCase;
  /** The MTF recipe of the run, where the run has one: its frequencies, and the plane it is of. */
  readonly recipe?: MtfRecipe;
  /**
   * The policy of the rung, for a comparator that sorts what it measures by a limit of the policy before any
   * figure is taken. Judging the figures stays the policy's (`comparePair`).
   */
  readonly policy?: RungPolicy;
  /**
   * The later steps of the first and of the second answer, in the order they were asked, where an engine was asked
   * the request again (`FollowUp`); left out where neither was.
   */
  readonly steps?: readonly [readonly StepAnswer[], readonly StepAnswer[]];
}

/** The comparison of one quantity. */
export interface QuantityComparator {
  /** The dotted id of the quantity whose data it reads. */
  readonly quantity: string;
  /**
   * The one rung it compares the quantity for, where several rungs compare one quantity, each by metrics of its
   * own; left out by the comparator of a quantity for every rung that has none of its own.
   */
  readonly rung?: string;
  /** Every metric it reports, in the order it reports them. */
  readonly metrics: readonly MetricDeclaration[];
  /**
   * For a comparator whose figures are each of several requests of a run at once (a spectrum's MTF is of the rays
   * of every line): the span a request belongs to, from its spec. The requests of one run and rung that give one
   * key are compared as one set, under the id of the first of them, and `compare` and `recorded` are then handed,
   * in the place of an answer, an engine's answers to every request of the span (`SpanAnswer`,
   * src/compare/span.ts). Undefined for a request that is a span of its own. A comparator without it compares
   * each request by itself.
   */
  spanOf?(spec: JsonObject): string | undefined;
  /**
   * The metrics of two answers. A pure function of its arguments: equal data and context give equal metrics, on
   * any machine, and swapping the two answers changes no value. Both are data of the quantity, valid by its schema
   * and with arrays that decode (for a comparator of spans: a `SpanAnswer` of such data); for anything else it may
   * throw. Answers that are valid and still cannot be set against each other (arrays of different shapes, a
   * context it needs and was not given) are not comparable, with a reason that quotes nothing but the data.
   */
  compare(a: JsonObject, b: JsonObject, context?: ComparisonContext): ComparatorOutcome;
  /**
   * What one answer reports beside what is compared, by name: values that are listed with every comparison of the
   * answer and never judged. A comparator has this only when its quantity has such values. The data is as for
   * `compare`; the values are as the answer has them, so one may be a NaN or an infinity. `context` is what the
   * answer is an answer to, for a comparator that names a value after it (the frequency of an MTF value).
   */
  recorded?(data: JsonObject, context?: ComparisonContext): { readonly [name: string]: readonly number[] };
}

/** A set of comparators that can be read but not added to. */
export interface ComparatorLookup {
  /**
   * The comparator of the quantity with this id for a rung: the one that names the rung, else the one of the
   * quantity that names none; undefined when there is neither. Without a rung: the one that names none.
   */
  get(quantity: string, rung?: string): QuantityComparator | undefined;
  /** Every comparator, sorted by quantity id and then by rung, in a fresh list. */
  list(): QuantityComparator[];
}

/**
 * A lookup of the given comparators. Throws when two of them are for one quantity and one rung, or both for every
 * rung of one quantity. A lookup is by exact id.
 */
export function createComparatorLookup(comparators: readonly QuantityComparator[]): ComparatorLookup {
  const keyOf = (quantity: string, rung?: string): string => JSON.stringify([quantity, rung ?? null]);
  const byKey = new Map<string, QuantityComparator>();
  for (const comparator of comparators) {
    const key = keyOf(comparator.quantity, comparator.rung);
    if (byKey.has(key)) {
      const of = comparator.rung === undefined ? "" : ` for the rung ${comparator.rung}`;
      throw new Error(`quantity ${comparator.quantity} has two comparators${of}`);
    }
    byKey.set(key, comparator);
  }
  const order = (comparator: QuantityComparator): string => `${comparator.quantity}\0${comparator.rung ?? ""}`;
  return Object.freeze({
    get: (quantity: string, rung?: string) => byKey.get(keyOf(quantity, rung)) ?? byKey.get(keyOf(quantity)),
    list: () => [...byKey.values()].sort((a, b) => (order(a) < order(b) ? -1 : order(a) > order(b) ? 1 : 0)),
  });
}
