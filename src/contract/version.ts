// The contract version rule: a major mismatch is incompatible; a minor only ever adds.

/** The contract version this code reads and writes, as `<major>.<minor>`. */
export const CONTRACT_VERSION = "1.0";

/** The major version: the `v1` of the schema directory, of the fixture corpus and of every schema `$id`. */
export const CONTRACT_MAJOR = 1;

const VERSION = /^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$/;

/** The major and minor of a version, or null when the text is not `<major>.<minor>` in plain decimal. */
function parseVersion(version: string): readonly [major: number, minor: number] | null {
  const match = VERSION.exec(version);
  return match === null ? null : [Number(match[1]), Number(match[2])];
}

/**
 * Whether a document or peer at `version` can be exchanged with this code: true exactly when `version` is
 * `<major>.<minor>` in plain decimal and its major is `CONTRACT_MAJOR`. The minor is not compared, because a minor
 * only adds optional fields and enum values; what an older reader does with those is decided by validation.
 */
export function isCompatibleContract(version: string): boolean {
  return parseVersion(version)?.[0] === CONTRACT_MAJOR;
}

/**
 * Whether `version` lies in the range of versions an engine says it speaks, both ends included. Versions are
 * ordered by major and then by minor, as numbers, so 1.10 is above 1.9 and a range that ends below a major or
 * starts above it holds no version of that major. False when any of the three texts is not `<major>.<minor>` in
 * plain decimal, and for every version when `min` is above `max`.
 */
export function isContractInRange(version: string, range: { readonly min: string; readonly max: string }): boolean {
  const [at, min, max] = [version, range.min, range.max].map(parseVersion);
  if (at === null || min === null || max === null) return false;
  const notBelow = at[0] > min[0] || (at[0] === min[0] && at[1] >= min[1]);
  const notAbove = at[0] < max[0] || (at[0] === max[0] && at[1] <= max[1]);
  return notBelow && notAbove;
}
