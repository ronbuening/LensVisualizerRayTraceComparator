// A LensVisualizer surface as a contract shape. LV's sag is `conicPolySag` (src/optics/internal/surfaceMath.ts):
//
//   z(h) = c h^2 / (1 + sqrt(1 - (1 + K) c^2 h^2)) + sum A_n h^n,   c = 1/R, or 0 when |R| > 1e10
//
// which is the contract's sag with `conic` = K and one term per coefficient A_n, so nothing is converted.
import type { AsphereTerm, SurfaceShape } from "../../contract/case.ts";
import type { ExportProblem } from "./exportProblems.ts";
import type { LvSurface } from "./types.ts";

/**
 * The radius beyond which LensVisualizer treats a surface as flat (`FLAT_R_THRESHOLD`); it writes a plane as 1e15.
 * The exporter checks every surface's shape against the profile LV built for it, so a change of this rule in LV is
 * reported as `surface-profile-unsupported`, not exported.
 */
export const LV_FLAT_RADIUS = 1e10;

const COEFFICIENT = /^A([1-9][0-9]*)$/;

/** A surface's shape, or what keeps it from having one. */
export type ShapeResult =
  { readonly ok: true; readonly shape: SurfaceShape } | { readonly ok: false; readonly problems: ExportProblem[] };

/** The profile kind LensVisualizer builds for a surface of this radius and asphere (`createSurfaceProfile`). */
function expectedProfileKind(flat: boolean, aspheric: boolean): string {
  if (aspheric) return "aspheric";
  return flat ? "flat" : "spherical";
}

/**
 * The contract shape of one prepared surface.
 *
 * - No asphere: a `plane` when |R| > `LV_FLAT_RADIUS`, else a `conic` of that radius with conic constant 0.
 * - An asphere: `conic` is its `K`, and each coefficient `A<n>` that is not zero is the term of power n, in order
 *   of power. LV has even `A4`..`A20` and odd `A3`..`A19`; the power is read from the name, so a coefficient LV
 *   adds is carried too. `radius` is null on a flat base, where LV sets the curvature to 0.
 * - An asphere whose coefficients are all zero has no term, which the contract does not allow: it is the `conic`
 *   it equals, with its `K`, or a `plane` on a flat base, where `K` has no effect.
 *
 * Problems, in place of a shape: a coefficient that is not `K` or `A<power>` (`asphere-coefficient-unknown`), and
 * a profile kind other than the one LV gives a surface of this radius and asphere (`surface-profile-unsupported`),
 * as a tilted mirror plane has.
 */
export function surfaceShape(surface: LvSurface): ShapeResult {
  const flat = Math.abs(surface.R) > LV_FLAT_RADIUS;
  const { asphere } = surface;
  const problems: ExportProblem[] = [];

  const expected = expectedProfileKind(flat, asphere !== null);
  if (surface.profile.kind !== expected) {
    const message =
      `surface ${surface.label} has the LensVisualizer profile "${surface.profile.kind}", ` +
      `not the ${expected} one its radius and asphere give`;
    problems.push({ code: "surface-profile-unsupported", message });
  }

  const terms: AsphereTerm[] = [];
  for (const [name, coeff] of Object.entries(asphere ?? {})) {
    if (name === "K") continue;
    const power = COEFFICIENT.exec(name)?.[1];
    if (power === undefined) {
      problems.push({
        code: "asphere-coefficient-unknown",
        message: `surface ${surface.label} has the asphere coefficient "${name}", which is not K or A<power>`,
      });
    } else if (coeff !== undefined && coeff !== 0) terms.push({ power: Number(power), coeff });
  }
  if (problems.length > 0) return { ok: false, problems };
  terms.sort((a, b) => a.power - b.power);

  if (asphere === null || terms.length === 0) {
    if (flat) return { ok: true, shape: { kind: "plane" } };
    return { ok: true, shape: { kind: "conic", radius: surface.R, conic: asphere?.K ?? 0 } };
  }
  return { ok: true, shape: { kind: "asphere", radius: flat ? null : surface.R, conic: asphere.K ?? 0, terms } };
}
