// The contract version rule: a major mismatch is incompatible; a minor only ever adds.

/** The contract version this code reads and writes, as `<major>.<minor>`. */
export const CONTRACT_VERSION = "1.0";

/** The major version: the `v1` of the schema directory, of the fixture corpus and of every schema `$id`. */
export const CONTRACT_MAJOR = 1;

const VERSION = /^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$/;

/**
 * Whether a document or peer at `version` can be exchanged with this code: true exactly when `version` is
 * `<major>.<minor>` in plain decimal and its major is `CONTRACT_MAJOR`. The minor is not compared, because a minor
 * only adds optional fields and enum values; what an older reader does with those is decided by validation.
 */
export function isCompatibleContract(version: string): boolean {
  const match = VERSION.exec(version);
  return match !== null && Number(match[1]) === CONTRACT_MAJOR;
}
