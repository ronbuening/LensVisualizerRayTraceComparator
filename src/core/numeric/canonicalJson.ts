// Canonical JSON: the one text every content hash in the comparator is computed over.
//
// Two values that are equal as JSON data give the same string whatever order their keys were inserted in, and a
// value JSON cannot carry is an error, never a silent `null` or a dropped key as with `JSON.stringify`.

type PathSegment = string | number;

const IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

/** The JSONPath-style location of a value: `$`, `$.name`, `$[3]`, `$["odd key"]`. */
function formatPath(path: readonly PathSegment[]): string {
  let text = "$";
  for (const segment of path) {
    if (typeof segment === "number") text += `[${segment}]`;
    else if (IDENTIFIER.test(segment)) text += `.${segment}`;
    else text += `[${JSON.stringify(segment)}]`;
  }
  return text;
}

function reject(what: string, path: readonly PathSegment[]): never {
  throw new Error(`canonicalJson: ${what} at ${formatPath(path)}`);
}

/** What a rejected object is, for the error message: its built-in tag, else the name of its class. */
function kindOf(value: object): string {
  const tag = Object.prototype.toString.call(value).slice(8, -1);
  if (tag !== "Object") return tag;
  const constructor: unknown = (value as { constructor?: unknown }).constructor;
  const named = typeof constructor === "function" && constructor !== Object && constructor.name !== "";
  return named ? constructor.name : "custom prototype";
}

function serialise(value: unknown, path: PathSegment[], ancestors: Set<object>): string {
  switch (typeof value) {
    case "string":
      return JSON.stringify(value);
    case "boolean":
      return value ? "true" : "false";
    case "number":
      if (!Number.isFinite(value)) reject(`non-finite number ${value}`, path);
      // Shortest round-trip form; -0 becomes "0".
      return JSON.stringify(value);
    case "undefined":
    case "function":
    case "symbol":
    case "bigint":
      return reject(typeof value, path);
    case "object":
      break;
  }
  if (value === null) return "null";
  if (ancestors.has(value)) reject("circular reference", path);

  const parts: string[] = [];
  let text: string;
  ancestors.add(value);
  if (Array.isArray(value)) {
    if (Object.getOwnPropertySymbols(value).length > 0) reject("symbol-keyed property", path);
    // Indexed, not iterated with map: a hole in a sparse array must be seen as the undefined it reads as.
    for (let index = 0; index < value.length; index++) {
      path.push(index);
      parts.push(serialise(value[index], path, ancestors));
      path.pop();
    }
    // Index keys come first and every element is present by now, so a key past them is a property an array
    // cannot carry as JSON (the `index` and `input` of a regular expression match, for one).
    const extra = Object.keys(value)[value.length];
    if (extra !== undefined) reject(`non-index array property ${JSON.stringify(extra)}`, path);
    text = `[${parts.join(",")}]`;
  } else {
    const prototype: unknown = Object.getPrototypeOf(value);
    if (prototype !== Object.prototype && prototype !== null) reject(`non-plain object (${kindOf(value)})`, path);
    if (Object.getOwnPropertySymbols(value).length > 0) reject("symbol-keyed property", path);
    // The default sort compares strings by UTF-16 code unit, which is the canonical order.
    for (const key of Object.keys(value).sort()) {
      path.push(key);
      parts.push(`${JSON.stringify(key)}:${serialise((value as Record<string, unknown>)[key], path, ancestors)}`);
      path.pop();
    }
    text = `{${parts.join(",")}}`;
  }
  ancestors.delete(value);
  return text;
}

/**
 * Serialises a JSON value to its canonical text: object keys sorted by UTF-16 code unit at every depth, arrays in
 * order, no whitespace, numbers in ECMAScript's shortest round-trip form and strings escaped as `JSON.stringify`
 * escapes them (a lone surrogate becomes a `\uXXXX` escape, so the text is always well-formed Unicode).
 *
 * Throws an error naming the JSONPath of the first offending value (`$.rays[2].x`) for anything JSON cannot carry
 * exactly: NaN and the infinities, `undefined` (also as an object value, an array element or a hole in a sparse
 * array), functions, symbols, bigints, symbol-keyed properties, a property of an array that is not one of its
 * elements, circular references and every object that is neither an array nor a plain object (Map, Set, Date, typed
 * arrays, boxed primitives, class instances). `toJSON` is never called. Non-enumerable properties are not part of
 * the value.
 *
 * -0 serialises as `0`, as ECMAScript's number-to-string conversion does, so 0 and -0 are the same canonical value
 * and hash alike. An array that must keep the sign of zero travels in the ndarray wire form.
 *
 * Idempotent: `canonicalJson(JSON.parse(canonicalJson(x))) === canonicalJson(x)`.
 */
export function canonicalJson(value: unknown): string {
  return serialise(value, [], new Set());
}
