/**
 * A JSON object whose members this layer carries without interpreting them: a quantity's spec and data, engine
 * options, method parameters. The type only says "an object"; that every member is JSON data with finite numbers
 * is checked when the enclosing document is validated.
 */
export interface JsonObject {
  readonly [key: string]: unknown;
}

/**
 * Freezes a JSON value at every depth, in place, and returns it. Meant for data without cycles, which is all JSON
 * can be; an object already frozen is still descended into.
 */
export function deepFreeze<T>(value: T): T {
  if (typeof value === "object" && value !== null) {
    Object.freeze(value);
    for (const member of Object.values(value)) deepFreeze(member);
  }
  return value;
}
