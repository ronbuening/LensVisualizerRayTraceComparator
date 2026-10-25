// Exact rational proof of singular pupil matrices. A rounded reciprocal must not turn an exact pupil at
// infinity into a spurious pupil 10^18 mm away. This is algebra on the contract's exact binary input numbers;
// no epsilon, tolerance or numerical floor decides a zero.
import type { RefSystem } from "./model.ts";
type Q = readonly [bigint, bigint];
const ZERO: Q = [0n, 1n],
  ONE: Q = [1n, 1n];
function fraction(n: bigint, d: bigint): Q {
  const sign = d < 0n ? -1n : 1n;
  n *= sign;
  d *= sign;
  let a = n < 0n ? -n : n,
    b = d;
  while (b !== 0n) [a, b] = [b, a % b];
  return [n / a, d / a];
}
function number(value: number): Q {
  if (value === 0) return ZERO;
  const view = new DataView(new ArrayBuffer(8));
  view.setFloat64(0, value);
  const bits = view.getBigUint64(0),
    exponent = Number((bits >> 52n) & 2047n);
  const mantissa = (bits & ((1n << 52n) - 1n)) | (exponent === 0 ? 0n : 1n << 52n);
  const signed = bits >> 63n ? -mantissa : mantissa;
  const power = (exponent === 0 ? 1 : exponent) - 1075;
  return power >= 0 ? fraction(signed << BigInt(power), 1n) : fraction(signed, 1n << BigInt(-power));
}
const add = (a: Q, b: Q): Q => fraction(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
const mul = (a: Q, b: Q): Q => fraction(a[0] * b[0], a[1] * b[1]);
const neg = (a: Q): Q => [-a[0], a[1]];
const div = (a: Q, b: Q): Q => fraction(a[0] * b[1], a[1] * b[0]);
type Matrix = readonly [Q, Q, Q, Q];
const identity = (): Matrix => [ONE, ZERO, ZERO, ONE];
const bend = ([a, b, c, d]: Matrix, power: Q): Matrix => [a, b, add(c, neg(mul(power, a))), add(d, neg(mul(power, b)))];
const transfer = ([a, b, c, d]: Matrix, gap: Q): Matrix => [add(a, mul(gap, c)), add(b, mul(gap, d)), c, d];

export function foldedSingularities(system: RefSystem, indices: ArrayLike<number>) {
  const path = system.opticalPath!;
  const stop = path.findIndex((step) => step.surfaceIndex === system.stopIndex);
  let total = identity(),
    front = identity(),
    rear = identity();
  let medium = ONE,
    sign = 1,
    stopSign = 1;
  for (let at = 0; at < path.length; at++) {
    const step = path[at],
      surface = system.surfaces[step.surfaceIndex];
    if (at === stop) {
      front = total;
      stopSign = sign;
    }
    const before = mul(number(sign), medium);
    const side = sign > 0 ? "front" : "rear";
    const active = step.incidentSide === undefined || step.incidentSide === "both" || step.incidentSide === side;
    const interaction = active ? step.interaction : "pass";
    const reference =
      side === "rear" && step.reverseMediumAfter !== undefined ? step.reverseMediumAfter : step.mediumAfter;
    if (interaction === "reflect") sign = -sign;
    if (interaction === "refract") medium = number(reference === null ? 1 : indices[reference ?? step.surfaceIndex]);
    if (at === stop) stopSign = sign;
    const after = mul(number(sign), medium);
    let curvature =
      surface.vertexRadius === null || surface.vertexRadius === undefined
        ? ZERO
        : div(ONE, number(surface.vertexRadius));
    for (const term of surface.profile.terms)
      if (term.power === 2) curvature = add(curvature, mul(number(2), number(term.coeff)));
    const power = interaction === "pass" || interaction === "block" ? ZERO : mul(add(after, neg(before)), curvature);
    total = bend(total, power);
    if (at > stop) rear = bend(rear, power);
    if (at + 1 < path.length) {
      const gap = div(add(number(system.surfaces[path[at + 1].surfaceIndex].z), neg(number(surface.z))), after);
      total = transfer(total, gap);
      if (at >= stop) rear = transfer(rear, gap);
    }
  }
  return {
    entrance: front[0][0] === 0n ? (front[1][0] < 0n ? -Infinity : Infinity) : null,
    exit: rear[3][0] === 0n ? (rear[1][0] < 0n ? stopSign * Infinity : -stopSign * Infinity) : null,
  };
}
