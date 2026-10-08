// Refraction at a surface, as vectors: Snell's law without an angle. Written from the law alone.
import type { Vec3 } from "../../estimators/imageProjection.ts";

/**
 * The direction of a ray behind a surface, as a unit vector, or null when the surface reflects it totally.
 *
 * `direction` is the ray in front of the surface, of any length; `normal` is the surface's unit normal at the hit,
 * turned either way; the indices are those of the media in front of the surface and behind it.
 *
 * With u the unit vector along the ray and N the normal turned so that cos i = u . N is not negative, the ray is
 * split into the part across the normal, T = u - cos i N, and the part along it. Snell's law, n sin i = n' sin t,
 * scales the first by m = n / n' and leaves it its direction, and the second is whatever keeps the length 1:
 *
 *   u' = m T + sqrt(1 - m^2 T . T) N
 *
 * Nothing in that form cancels. The textbook m u + (cos t - m cos i) N subtracts two nearly equal numbers wherever
 * the indices are close or the incidence is steep, and sin^2 i as 1 - cos^2 i loses the digits of a small angle;
 * here T is formed component by component, so its absolute error is one rounding at any angle. The ray is totally
 * reflected where m^2 T . T is above 1. The result is divided by its own length, which is 1 to rounding, so that
 * the next stretch's parameter is a length.
 *
 * Two media of the same index bend nothing: the direction comes back as it was given, bit for bit.
 */
export function refract(direction: Vec3, normal: Vec3, indexBefore: number, indexAfter: number): Vec3 | null {
  if (indexBefore === indexAfter) return direction;
  const [dx, dy, dz] = direction;
  const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
  const [ux, uy, uz] = [dx / length, dy / length, dz / length];
  const along = ux * normal[0] + uy * normal[1] + uz * normal[2];
  const turn = along < 0 ? -1 : 1;
  const [nx, ny, nz] = [turn * normal[0], turn * normal[1], turn * normal[2]];
  const cosine = turn * along;
  const [tx, ty, tz] = [ux - cosine * nx, uy - cosine * ny, uz - cosine * nz];
  const ratio = indexBefore / indexAfter;
  const under = 1 - ratio * ratio * (tx * tx + ty * ty + tz * tz);
  if (!(under >= 0)) return null;
  const forward = Math.sqrt(under);
  const [ox, oy, oz] = [ratio * tx + forward * nx, ratio * ty + forward * ny, ratio * tz + forward * nz];
  const norm = Math.sqrt(ox * ox + oy * oy + oz * oz);
  return [ox / norm, oy / norm, oz / norm];
}
