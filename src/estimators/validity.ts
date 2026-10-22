// Which rays an estimator takes. A comparison on identical rays is of one estimator applied to every engine's
// trace of the same rays, and it is of the same rays only when each engine's bundle is cut down to the rays that
// every engine brought to the image: a ray one engine lost is in no engine's sum. A mask says which those are, one
// element a ray: 0 for a ray that is left out, 1 for one that is taken.

function sameLength(name: string, arrays: readonly ArrayLike<number>[]): number {
  if (arrays.length === 0) throw new RangeError(`${name}: no array is given, so the number of rays is not known`);
  const count = arrays[0].length;
  const other = arrays.findIndex((array) => array.length !== count);
  if (other >= 0) throw new RangeError(`${name}: array ${other} has ${arrays[other].length} rays and array 0 ${count}`);
  return count;
}

/**
 * The mask of the rays whose element of `values` is `wanted`: of a trace's `status`, with the status "ok" for
 * `wanted`, the rays that reached the image. An element that is not a number is not `wanted`.
 */
export function maskWhere(values: ArrayLike<number>, wanted: number): Uint8Array {
  const mask = new Uint8Array(values.length);
  for (let ray = 0; ray < values.length; ray++) mask[ray] = values[ray] === wanted ? 1 : 0;
  return mask;
}

/**
 * The mask of the rays that every one of `masks` takes: 1 where no mask has a 0 (or an element that is no number),
 * 0 elsewhere. With the masks of the engines of a comparison it is the rays valid in every engine, and with one
 * mask it is that mask as 0 and 1. Throws a RangeError without a mask, and when the masks differ in length: they
 * are then not of the same rays.
 */
export function intersectValidity(masks: readonly ArrayLike<number>[]): Uint8Array {
  const count = sameLength("intersectValidity", masks);
  const every = new Uint8Array(count).fill(1);
  for (const mask of masks) {
    for (let ray = 0; ray < count; ray++) if (!mask[ray]) every[ray] = 0;
  }
  return every;
}

/** How many rays a mask takes. */
export function countValid(mask: ArrayLike<number>): number {
  let taken = 0;
  for (let ray = 0; ray < mask.length; ray++) if (mask[ray]) taken++;
  return taken;
}
