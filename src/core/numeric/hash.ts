import { createHash } from "node:crypto";

import { canonicalJson } from "./canonicalJson.ts";

/**
 * Lowercase hex SHA-256 of the given bytes, or of a string's UTF-8 encoding. A typed-array view is hashed over
 * exactly the bytes it covers. A lone surrogate has no UTF-8 encoding and is hashed as U+FFFD, as Node encodes it;
 * `canonicalJson` never produces one.
 */
export function sha256Hex(data: Uint8Array | string): string {
  const hash = createHash("sha256");
  if (typeof data === "string") hash.update(data, "utf8");
  else hash.update(data);
  return hash.digest("hex");
}

/**
 * The content hash of a JSON value: `sha256Hex(canonicalJson(value))`. Equal JSON data gives an equal hash whatever
 * the key insertion order; a value `canonicalJson` rejects throws the same error here.
 */
export function hashCanonical(value: unknown): string {
  return sha256Hex(canonicalJson(value));
}
