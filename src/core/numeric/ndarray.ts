// The bit-exact wire form of a numeric array:
//
//   { "$nd": { "dtype": "f8", "shape": [2, 3], "data": "<base64>", "sha256": "<hex>" } }
//
// `data` is the elements in C (row-major) order as little-endian bytes, in standard padded base64. `sha256` is the
// digest of those bytes, so it covers the numbers but not dtype or shape; whatever hashes the enclosing JSON covers
// those. Plain JSON numbers cannot carry NaN, the infinities or -0, and their text differs between languages; this
// form carries every bit pattern unchanged.
//
// Bytes are copied between the typed array and the wire, never converted through a JavaScript number: ECMAScript
// lets an engine replace a NaN's payload whenever a NaN is written as a number (DataView.setFloat64 included), and
// a raw byte copy cannot. Byte order is therefore handled by swapping bytes on a big-endian host.
import { sha256Hex } from "./hash.ts";

/** Element types of the wire form: IEEE 754 float64, two's-complement int32 and uint8. */
export const ND_DTYPES = ["f8", "i4", "u1"] as const;
/** One element type of the wire form. */
export type NdDtype = (typeof ND_DTYPES)[number];

/** The typed array that holds each element type in memory. */
export interface NdValuesByDtype {
  f8: Float64Array;
  i4: Int32Array;
  u1: Uint8Array;
}
/** Any typed array the wire form can carry. */
export type NdValues = NdValuesByDtype[NdDtype];

/** The wire form itself. `isNdArray` checks this structure; only `decodeNdArray` checks the bytes behind it. */
export interface NdArrayWire {
  readonly $nd: {
    readonly dtype: NdDtype;
    /** Non-negative integers whose product is the element count; `[]` is a single element. */
    readonly shape: readonly number[];
    /** Base64 of the little-endian bytes, C order. */
    readonly data: string;
    /** Lowercase hex SHA-256 of those bytes. */
    readonly sha256: string;
  };
}

/** A decoded array: `values` is flat, in C order, and holds `shape`'s product of elements. */
export type NdArray = {
  [D in NdDtype]: { readonly dtype: D; readonly shape: readonly number[]; readonly values: NdValuesByDtype[D] };
}[NdDtype];

const ITEM_SIZE: Readonly<Record<NdDtype, number>> = { f8: 8, i4: 4, u1: 1 };
const WIRE_KEYS: readonly string[] = ["dtype", "shape", "data", "sha256"];
const SHA256_HEX = /^[0-9a-f]{64}$/;

/** Whether this host keeps the least significant byte of a typed-array element first. */
export const HOST_LITTLE_ENDIAN: boolean = new Uint8Array(new Uint16Array([1]).buffer)[0] === 1;

/** Reverses the bytes of every element in place. Its own inverse, so it serves both directions. */
function swapElementBytes(bytes: Uint8Array, itemSize: number): void {
  for (let start = 0; start < bytes.length; start += itemSize) {
    for (let low = start, high = start + itemSize - 1; low < high; low++, high--) {
      const byte = bytes[low];
      bytes[low] = bytes[high];
      bytes[high] = byte;
    }
  }
}

/**
 * The elements of a typed array as little-endian bytes, in a fresh `Uint8Array`. Bit-exact for every value,
 * including NaN payloads. `hostLittleEndian` is the byte order of the array's memory; it is a parameter only so
 * the big-endian path can be tested on a little-endian machine.
 */
export function toLittleEndianBytes(values: NdValues, hostLittleEndian: boolean = HOST_LITTLE_ENDIAN): Uint8Array {
  const bytes = new Uint8Array(values.byteLength);
  bytes.set(new Uint8Array(values.buffer, values.byteOffset, values.byteLength));
  if (!hostLittleEndian) swapElementBytes(bytes, values.BYTES_PER_ELEMENT);
  return bytes;
}

/**
 * The inverse of `toLittleEndianBytes`: a fresh typed array of `dtype` holding the elements that `bytes` encodes
 * in little-endian order. Bit-exact; the result never shares memory with `bytes`. Throws when `bytes` is not a
 * whole number of elements.
 */
export function fromLittleEndianBytes<D extends NdDtype>(
  dtype: D,
  bytes: Uint8Array,
  hostLittleEndian: boolean = HOST_LITTLE_ENDIAN,
): NdValuesByDtype[D] {
  const itemSize = ITEM_SIZE[dtype];
  if (bytes.length % itemSize !== 0) {
    throw new Error(`ndarray: ${bytes.length} bytes is not a whole number of ${dtype} elements (${itemSize} bytes)`);
  }
  // Copying into a new buffer also aligns it: a Buffer from the pool may start at any offset.
  const copy = new Uint8Array(bytes.length);
  copy.set(bytes);
  if (!hostLittleEndian) swapElementBytes(copy, itemSize);
  // A table, not a switch, so the result type follows `dtype` without a cast.
  const byDtype: { [K in NdDtype]: () => NdValuesByDtype[K] } = {
    f8: () => new Float64Array(copy.buffer),
    i4: () => new Int32Array(copy.buffer),
    u1: () => copy,
  };
  return byDtype[dtype]();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isDtype(value: unknown): value is NdDtype {
  return (ND_DTYPES as readonly unknown[]).includes(value);
}

function isShape(shape: unknown): shape is readonly number[] {
  if (!Array.isArray(shape)) return false;
  // Indexed, so a hole in a sparse array is seen as the undefined it reads as.
  for (let axis = 0; axis < shape.length; axis++) {
    const size: unknown = shape[axis];
    if (typeof size !== "number" || !Number.isSafeInteger(size) || size < 0) return false;
  }
  return true;
}

/** A value as an error message shows it; never throws, whatever it is given. */
function show(value: unknown): string {
  if (typeof value === "string") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${Array.from(value, show).join(",")}]`;
  return typeof value === "object" && value !== null ? "an object" : String(value);
}

function shapeProblem(shape: unknown): string | null {
  return isShape(shape) ? null : `shape must be an array of non-negative integers, got ${show(shape)}`;
}

function elementCount(shape: readonly number[]): number {
  return shape.reduce((count, size) => count * size, 1);
}

/** Why a value is not the wire form, or null when it is. Structure only: the bytes are not looked at. */
function wireProblem(value: unknown): string | null {
  if (!isRecord(value) || !Object.hasOwn(value, "$nd")) return 'expected an object with a "$nd" key';
  const beside = Object.keys(value).find((key) => key !== "$nd");
  if (beside !== undefined) return `unexpected key ${show(beside)} beside "$nd"`;
  const nd = value.$nd;
  if (!isRecord(nd)) return '"$nd" must be an object';
  const extra = Object.keys(nd).find((key) => !WIRE_KEYS.includes(key));
  if (extra !== undefined) return `unknown key ${show(extra)} in "$nd"`;
  if (!isDtype(nd.dtype)) return `dtype must be one of ${ND_DTYPES.join(", ")}, got ${show(nd.dtype)}`;
  const shape = shapeProblem(nd.shape);
  if (shape !== null) return shape;
  if (typeof nd.data !== "string") return `data must be a base64 string, got ${show(nd.data)}`;
  if (typeof nd.sha256 !== "string" || !SHA256_HEX.test(nd.sha256)) {
    return `sha256 must be 64 lowercase hex characters, got ${show(nd.sha256)}`;
  }
  return null;
}

/**
 * True exactly when `value` has the structure of the wire form: an object whose only key is `$nd`, holding a known
 * dtype, a shape of non-negative integers, a string `data`, a 64-character lowercase hex `sha256` and no other key.
 * It does not decode `data`, so a true result does not mean `decodeNdArray` will accept the bytes.
 */
export function isNdArray(value: unknown): value is NdArrayWire {
  return wireProblem(value) === null;
}

/**
 * Encodes a typed array in the wire form. `values` is the flat array in C order; `shape` defaults to
 * `[values.length]`. Every bit pattern is kept, so NaN payloads, -0, the infinities and subnormals all round-trip
 * through `decodeNdArray`, and the result is the same on little- and big-endian hosts. Throws when `shape` is not
 * a list of non-negative integers whose product is `values.length`, and when `values` is any other kind of typed
 * array or not a typed array at all.
 */
export function encodeNdArray(values: NdValues, shape?: readonly number[]): NdArrayWire {
  let dtype: NdDtype;
  if (values instanceof Float64Array) dtype = "f8";
  else if (values instanceof Int32Array) dtype = "i4";
  else if (values instanceof Uint8Array) dtype = "u1";
  else throw new Error("ndarray: only a Float64Array, an Int32Array or a Uint8Array can be encoded");

  // Defaulted here, not in the signature, so that a value with no length gets the error above.
  if (shape === undefined) shape = [values.length];
  const problem = shapeProblem(shape);
  if (problem !== null) throw new Error(`ndarray: ${problem}`);
  const count = elementCount(shape);
  if (count !== values.length) {
    throw new Error(
      `ndarray: the product of shape ${show(shape)} is ${count} but the array length is ${values.length}`,
    );
  }
  const bytes = toLittleEndianBytes(values);
  const data = Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).toString("base64");
  return { $nd: { dtype, shape: [...shape], data, sha256: sha256Hex(bytes) } };
}

/**
 * Decodes the wire form into a fresh typed array, bit for bit. Throws an error saying what is wrong unless all of
 * these hold: the structure is the one `isNdArray` accepts; `data` is canonical base64 (standard alphabet, padded,
 * no whitespace); its byte length is the shape's product times the element size; and the bytes hash to `sha256`.
 */
export function decodeNdArray(wire: unknown): NdArray {
  if (!isNdArray(wire)) throw new Error(`ndarray: ${wireProblem(wire)}`);
  const { dtype, shape, data, sha256 } = wire.$nd;
  const bytes = Buffer.from(data, "base64");
  // Node's decoder skips what it does not understand, so the only strict test is encoding the result again.
  if (bytes.toString("base64") !== data) {
    throw new Error("ndarray: data is not canonical base64 (standard alphabet, padded, no whitespace)");
  }
  const expected = elementCount(shape) * ITEM_SIZE[dtype];
  if (bytes.length !== expected) {
    throw new Error(`ndarray: data is ${bytes.length} bytes but shape ${show(shape)} of ${dtype} needs ${expected}`);
  }
  const actual = sha256Hex(bytes);
  if (actual !== sha256) {
    throw new Error(`ndarray: sha256 mismatch: the data hashes to ${actual} but the wire form says ${sha256}`);
  }
  // `fromLittleEndianBytes` pairs the typed array with its dtype; the cast only restates that for the union.
  return { dtype, shape: [...shape], values: fromLittleEndianBytes(dtype, bytes) } as NdArray;
}

/**
 * Row `row` of a 2-D array as a view on the array's own memory: nothing is copied, and a write through the view
 * is a write to the array. Throws unless the array is 2-D and the row exists.
 */
export function ndRow<A extends NdArray>(array: A, row: number): A["values"] {
  if (array.shape.length !== 2) throw new Error(`ndarray: a row needs a 2-D array, got shape ${show(array.shape)}`);
  const [rows, columns] = array.shape;
  if (!Number.isInteger(row) || row < 0 || row >= rows) {
    throw new Error(`ndarray: row ${row} does not exist in an array of ${rows} rows`);
  }
  return array.values.subarray(row * columns, (row + 1) * columns) as A["values"];
}
