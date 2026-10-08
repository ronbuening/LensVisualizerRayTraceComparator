// The options of the fake engine, as its configuration writes them under `engines.<id>.options`.
import { isEngineId } from "../../contract/engine.ts";
import { hashCanonical } from "../../core/numeric/hash.ts";

/**
 * How the fake engine misbehaves when it is asked to `run`; `hello` and `shutdown` are always answered properly.
 *
 * - `none`: it does not;
 * - `protocol-error`: it answers `ok: false`, as an engine that could not handle the message;
 * - `invalid-result`: it answers with a result that has no `diagnostics`, which no result may lack;
 * - `wrong-request-id`: it answers with a valid result that echoes another request id;
 * - `throw`: its handler throws, as a worker that crashed.
 */
export const FAIL_MODES = ["none", "protocol-error", "invalid-result", "wrong-request-id", "throw"] as const;
/** One way the fake engine misbehaves. */
export type FailMode = (typeof FAIL_MODES)[number];

/** The fake engine's options with every default filled in. */
export interface FakeEngineOptions {
  /** The engine id its descriptor and results carry. */
  readonly id: string;
  /** Added to every value it echoes that is not a NaN; 0 adds nothing. */
  readonly bias: number;
  /** False: it declares no quantity and answers every run "unsupported". */
  readonly offersQuantities: boolean;
  readonly failMode: FailMode;
  /** The fingerprint it reports: the one given, else `fakeFingerprint` of the other options. */
  readonly fingerprint: string;
}

/** The version of the fake engine's behaviour. It is part of the derived fingerprint, so raising it retires results. */
export const FAKE_ENGINE_VERSION = "1";

const OPTION_NAMES: readonly string[] = ["bias", "failMode", "fingerprint", "id", "offersQuantities"];

function isFailMode(value: unknown): value is FailMode {
  return (FAIL_MODES as readonly unknown[]).includes(value);
}

/**
 * The fingerprint of a fake engine that was given none: the SHA-256 of the canonical JSON of its version and its
 * other options. Equal options give an equal fingerprint, in any process and on any machine, and a change to any of
 * them gives another.
 */
export function fakeFingerprint(options: Omit<FakeEngineOptions, "fingerprint">): string {
  const { id, bias, offersQuantities, failMode } = options;
  return hashCanonical({
    engine: "lvrtc-fake",
    version: FAKE_ENGINE_VERSION,
    options: { id, bias, offersQuantities, failMode },
  });
}

/**
 * Checks the options a fake engine is created with and fills in the defaults: `bias` 0, `offersQuantities` true,
 * `failMode` "none" and a fingerprint derived from those. Throws an error naming the option when `options` is not
 * an object, lacks `id`, holds an option the fake engine does not have, or holds a value of the wrong kind.
 */
export function parseFakeOptions(options: unknown): FakeEngineOptions {
  const problem = (text: string): Error => new Error(`fake engine: ${text}`);
  if (typeof options !== "object" || options === null || Array.isArray(options)) {
    throw problem("options must be an object");
  }
  const given: Readonly<Record<string, unknown>> = { ...options };
  const unknown = Object.keys(given).find((name) => !OPTION_NAMES.includes(name));
  if (unknown !== undefined) throw problem(`unknown option "${unknown}" (it has ${OPTION_NAMES.join(", ")})`);

  const { id, bias = 0, offersQuantities = true, failMode = "none", fingerprint } = given;
  if (!isEngineId(id)) {
    throw problem('option "id" must be an engine id: a lowercase letter, then lowercase letters, digits or "-"');
  }
  if (typeof bias !== "number" || !Number.isFinite(bias)) throw problem('option "bias" must be a finite number');
  if (typeof offersQuantities !== "boolean") throw problem('option "offersQuantities" must be a boolean');
  if (!isFailMode(failMode)) throw problem(`option "failMode" must be one of ${FAIL_MODES.join(", ")}`);
  if (fingerprint !== undefined && (typeof fingerprint !== "string" || fingerprint === "")) {
    throw problem('option "fingerprint" must be a non-empty string');
  }
  const stated = { id, bias, offersQuantities, failMode };
  return { ...stated, fingerprint: fingerprint ?? fakeFingerprint(stated) };
}
