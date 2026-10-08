// What the reference engine's tests share: exact arithmetic to hold its numbers to, and small cases to ask it about.
// Nothing here is the engine's own code: every expected value is worked out another way.
import { finalizeCase } from "../../../src/contract/case.ts";
import type { AsphereTerm, OpticalCase, SurfaceIR, SurfaceShape } from "../../../src/contract/case.ts";
import { encodeNdArray } from "../../../src/core/numeric/ndarray.ts";

/** The distance between a double and the next one above it in magnitude: one unit in its last place. */
export function ulp(value: number): number {
  const magnitude = Math.abs(value);
  if (magnitude === 0) return Number.MIN_VALUE;
  const view = new DataView(new ArrayBuffer(8));
  view.setFloat64(0, magnitude);
  view.setBigUint64(0, view.getBigUint64(0) + 1n);
  return view.getFloat64(0) - magnitude;
}

/** A finite double as the exact fraction `mantissa * 2^exponent`. */
function dyadic(value: number): { mantissa: bigint; exponent: number } {
  const view = new DataView(new ArrayBuffer(8));
  view.setFloat64(0, value);
  const bits = view.getBigUint64(0);
  const biased = Number((bits >> 52n) & 0x7ffn);
  const fraction = bits & 0xf_ffff_ffff_ffffn;
  // A subnormal has no hidden bit and the exponent of the smallest normal.
  const magnitude = biased === 0 ? fraction : fraction | (1n << 52n);
  const mantissa = bits >> 63n === 1n ? -magnitude : magnitude;
  return { mantissa, exponent: (biased === 0 ? 1 : biased) - 1075 };
}

/**
 * The sum of `coeff * r^power` over the terms, computed without rounding and then rounded once: every double is a
 * whole number times a power of two, so the sum is one too, and BigInt holds it exactly.
 */
export function exactPolynomial(terms: readonly AsphereTerm[], r: number): number {
  const base = dyadic(r);
  const products = terms.map(({ power, coeff }) => {
    const factor = dyadic(coeff);
    return {
      mantissa: factor.mantissa * base.mantissa ** BigInt(power),
      exponent: factor.exponent + base.exponent * power,
    };
  });
  const lowest = Math.min(0, ...products.map((product) => product.exponent));
  const sum = products.reduce((total, { mantissa, exponent }) => total + (mantissa << BigInt(exponent - lowest)), 0n);
  // The sum can have thousands of bits. Its leading 64 are kept, with one more that says whether anything was cut
  // off, so that Number(bigint), which rounds to nearest with ties to even, rounds the whole sum and not a part of
  // it. What is left to scale by is a power of two within a double's range, which is exact.
  const magnitude = sum < 0n ? -sum : sum;
  const cut = BigInt(Math.max(0, magnitude.toString(2).length - 64));
  const kept = magnitude >> cut;
  const sticky = kept << cut === magnitude ? 0n : 1n;
  const rounded = Number(kept | sticky) * 2 ** (lowest + Number(cut));
  return sum < 0n ? -rounded : rounded;
}

/** The sum of the magnitudes of a polynomial's terms at `r`: what a rounding of its evaluation is small against. */
export function termScale(terms: readonly AsphereTerm[], r: number): number {
  return terms.reduce((scale, { power, coeff }) => scale + Math.abs(coeff) * r ** power, 0);
}

/** One surface of a test system: where it is, its shape, and what follows it. */
export interface SurfaceOf {
  readonly z: number;
  readonly shape: SurfaceShape;
  /** The index of the medium after the surface, one per line; a single number serves every line. */
  readonly index: number | readonly number[];
  /** The clear semi-diameter; 10 mm without it. */
  readonly semiDiameter?: number;
  /** The clip radius, to the last bit; without it the clear semi-diameter and 1e-9 mm, as a case source widens it. */
  readonly clipRadius?: number;
  /** The radius of a central obstruction; none without it. */
  readonly innerSemiDiameter?: number;
  readonly synthetic?: "rearPlate";
}

/** What a test system is under, beside its surfaces. */
export interface SystemOf {
  readonly stopIndex?: number;
  readonly stopSemiDiameter?: number;
  /** The image plane; 100 mm behind the last vertex without it. */
  readonly imageZ?: number;
  /** A finite object plane; without it the object is at infinity. */
  readonly objectZ?: number;
  /** How many lines the case has; 1 without it. */
  readonly lines?: number;
}

/** A sphere of the given radius; a plane for an infinite one. */
export function sphere(radius: number): SurfaceShape {
  return Number.isFinite(radius) ? { kind: "conic", radius, conic: 0 } : { kind: "plane" };
}

/**
 * A valid optical case of the given surfaces, finished as a case source would finish it: the thicknesses follow
 * from the vertices, the last one reaching the image plane, and the last lens surface is the last one that is not
 * a rear plate.
 */
export function caseOf(surfaces: readonly SurfaceOf[], more: SystemOf = {}): OpticalCase {
  const { stopIndex = 0, stopSemiDiameter = 2, lines = 1 } = more;
  const last = surfaces[surfaces.length - 1];
  const imageZ = more.imageZ ?? last.z + 100;
  const rows = Array.from({ length: lines }, (_unused, line) =>
    surfaces.map(({ index }) => (typeof index === "number" ? index : index[line])),
  );
  const system = {
    surfaces: surfaces.map((surface, at): SurfaceIR => {
      const semiDiameter = surface.semiDiameter ?? 10;
      return {
        label: String(at + 1),
        z: surface.z,
        thickness: (at + 1 < surfaces.length ? surfaces[at + 1].z : imageZ) - surface.z,
        shape: surface.shape,
        aperture: {
          semiDiameter: surface.clipRadius ?? semiDiameter + 1e-9,
          nominalSemiDiameter: semiDiameter,
          innerSemiDiameter: surface.innerSemiDiameter ?? 0,
        },
        elementId: 0,
        ...(surface.synthetic === undefined ? {} : { synthetic: surface.synthetic }),
      };
    }),
    stopIndex,
    lastLensSurfaceIndex: surfaces.findLastIndex((surface) => surface.synthetic === undefined),
    designImageZ: imageZ,
  };
  return finalizeCase({
    label: { name: "test system" },
    system,
    conditions: {
      object: more.objectZ === undefined ? { kind: "infinity" } : { kind: "finite", z: more.objectZ },
      stopSemiDiameter,
      imageZ,
      lines: rows.map((_row, line) => ({ wavelengthNm: 587.5618 - 50 * line, weight: 1, indexSource: "authored" })),
      indexAfterSurface: encodeNdArray(Float64Array.from(rows.flat()), [lines, surfaces.length]),
    },
    provenance: { source: { kind: "fixture", name: "test system" }, producer: { tool: "lvrtc", version: "0.1.0" } },
  });
}
