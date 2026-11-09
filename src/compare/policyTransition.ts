// The transition of the limits file through the rename of the check ids (Stage 9.7): until the maintainer's refresh
// (Stage 9.9) rewrites the committed baselines, those other than the catalog's state policy version 24, the last
// written under the old ids, while the limits file at hand is version 25, the same limits under the new ids. Removed
// with `POLICY_V24_HASH` after that refresh, when `lvrtc verify` again requires the exact version and hash.
import type { Policy } from "../contract/policy.ts";
import { LEGACY_IDS, snapshotPolicyIds } from "../core/legacyIds.ts";
import type { LegacyMaps } from "../core/legacyIds.ts";
import { hashCanonical } from "../core/numeric/hash.ts";

/** The maps the transition reads the policy at hand back by: the legacy-id maps. */
export type TransitionMaps = LegacyMaps;

/**
 * The canonical hash of policy version 24, the last written under the old check ids, which the committed baselines
 * other than the catalog's state. Removed after the maintainer's refresh of Stage 9.9.
 */
export const POLICY_V24_HASH = "be3e032669e5859702174ce5c6ea63cd00f44850c893b09e005c0d8a407c4889";

/**
 * A policy as it was before the check ids were renamed: its entries under the old ids (the inverse of the check map
 * of `maps`) and its version one less. Every other member is the policy's own.
 */
export function policyBeforeRename(policy: Policy, maps: LegacyMaps = LEGACY_IDS): Policy {
  return { ...snapshotPolicyIds(policy, maps), version: policy.version - 1 };
}

/**
 * Whether a baseline that states version 24 and `POLICY_V24_HASH` was judged by the very limits of the policy at
 * hand, version 25: exactly when that policy names no check by an old id and, with its entries under the old ids
 * and its version 24, hashes to that hash. Anything else is no transition.
 */
export function matchesBeforeRename(
  stated: { readonly hash: string; readonly version: number },
  policy: Policy,
  maps: LegacyMaps = LEGACY_IDS,
): boolean {
  return (
    stated.version === 24 &&
    policy.version === 25 &&
    stated.hash === POLICY_V24_HASH &&
    Object.keys(policy.rungs).every((id) => !Object.hasOwn(maps.checks, id)) &&
    hashCanonical(policyBeforeRename(policy, maps)) === stated.hash
  );
}
