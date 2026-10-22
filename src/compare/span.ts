// A span: several requests of one run that a rung compares as one, because the figure it judges is of all of them
// together. The MTF of a spectrum is of the rays of every line, and each line's rays are a request of their own.
// A comparator says which requests belong together (`QuantityComparator.spanOf`); the comparison of a run then
// hands it, in the place of one answer, everything one engine answered to the requests of the span.
import type { JsonObject } from "../contract/json.ts";

/** One request of a span as one engine answered it. */
export type SpanMember = {
  /** The id of the request. */
  readonly requestId: string;
  /** The spec of the request, as the store keeps it with the answer. */
  readonly spec: JsonObject;
  /** The data of the engine's "ok" result: valid by the quantity's schema, with arrays that decode. */
  readonly data: JsonObject;
};

/**
 * What a comparator of spans is handed in the place of one answer: one engine's answers to every request of a
 * span, in the order of the requests in the run. An engine that has no "ok" answer to one of them has no
 * `SpanAnswer`: it enters the comparison as that request left it, unsupported or in error.
 *
 * A type alias, so that a value of it is a `JsonObject` and can stand where the data of a participant stands.
 */
export type SpanAnswer = { readonly members: readonly SpanMember[] };
