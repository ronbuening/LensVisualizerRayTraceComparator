// The fake's off-axis geometry of one chromatic channel, under LV's name: the coma tab's geometry of the field, its
// chief ray solved "at the channel" by a height of the fake's own, a ten-thousandth of a millimetre a degree for each
// channel's step from G (0 on the axis), so that each channel launches a chief ray of its own, as LV's do.
import { computeOffAxisFieldGeometry } from "../spots.js";
import type { FakeState } from "../../types.js";

const CHANNEL_STEP: Readonly<Record<string, number>> = { R: -1, G: 0, B: 1, V: 2 };

export function computeOffAxisChannelFieldGeometry(
  state: FakeState,
  fieldFraction: number,
  channel: string,
  stateGeometry?: unknown,
) {
  const field = computeOffAxisFieldGeometry(state, fieldFraction, stateGeometry);
  if (field === null || "kind" in field) return field;
  return { ...field, yChief: field.yChief + (CHANNEL_STEP[channel] ?? 0) * 1e-4 * field.fieldAngleDeg };
}
