// The options that say which state of a lens a command is about, as `lvrtc export` and `lvrtc mtf` read them.
import type { RunAperture } from "../contract/runSpec.ts";
import { UsageError } from "../core/usageError.ts";

/** A slider position from the command line: a number from 0 to 1. Throws a `UsageError` for anything else. */
export function sliderPosition(option: string, text: string): number {
  const value = text.trim() === "" ? Number.NaN : Number(text);
  if (!(value >= 0 && value <= 1)) throw new UsageError(`${option} needs a number from 0 to 1, got "${text}"`);
  return value;
}

/** `--aperture`: "wide-open", "f/<N>" or "r=<mm>", with a positive number. Throws a `UsageError` for anything else. */
export function apertureOption(text: string): RunAperture {
  if (text === "wide-open") return { kind: "wide-open" };
  const [, form, digits] = /^(f\/|r=)(.+)$/.exec(text) ?? [];
  const value = digits === undefined || digits.trim() === "" ? Number.NaN : Number(digits);
  if (!(Number.isFinite(value) && value > 0)) {
    throw new UsageError(`--aperture needs wide-open, f/<N> or r=<mm> with a positive number, got "${text}"`);
  }
  return form === "f/" ? { kind: "f-number", value } : { kind: "stop-radius", mm: value };
}
