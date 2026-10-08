// `selftest.echo` as contract/CONTRACT.md defines it, on typed arrays. Every element is produced by a rule that
// fixes its bits, so two implementations of the rules give byte-equal arrays.

/** The quiet NaN with no payload: what a multiplication that has no value (an infinity times 0) is written as. */
const QUIET_NAN_BITS = 0x7ff8000000000000n;

/**
 * Scales `values` and sums the outcome.
 *
 * - An element that is a NaN is copied bit for bit, sign and payload included, and takes no part in the arithmetic.
 * - Any other element becomes `element * scale`, then `+ bias` when `bias` is not 0: one IEEE 754 double operation
 *   each. A product of 1 is therefore the element itself, so -0, the infinities and subnormals keep their bits.
 * - An outcome that is a NaN the arithmetic made (an infinity times 0) is written as the quiet NaN
 *   `7ff8000000000000`, whatever NaN the processor produced.
 * - `sum` is the running sum of the outcomes in index order, starting from 0, each addition rounded on its own (a
 *   plain loop, never a compensated sum); null when it is not finite.
 *
 * `bias` is not part of the quantity: it is how a fake engine is made to differ from another. The result is a new
 * array; `values` is not changed.
 */
export function echoValues(
  values: Float64Array,
  scale: number,
  bias: number = 0,
): { values: Float64Array; sum: number | null } {
  const echoed = new Float64Array(values.length);
  // Bytes, not numbers: writing a NaN as a number lets the engine replace its payload.
  new Uint8Array(echoed.buffer).set(new Uint8Array(values.buffer, values.byteOffset, values.byteLength));
  const bits = new BigUint64Array(echoed.buffer);

  let sum = 0;
  for (let index = 0; index < values.length; index++) {
    const value = values[index];
    if (!Number.isNaN(value)) {
      const scaled = bias === 0 ? value * scale : value * scale + bias;
      if (Number.isNaN(scaled)) bits[index] = QUIET_NAN_BITS;
      else echoed[index] = scaled;
    }
    sum += echoed[index];
  }
  return { values: echoed, sum: Number.isFinite(sum) ? sum : null };
}
