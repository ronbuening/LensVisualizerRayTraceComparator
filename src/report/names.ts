// How a report names a check, a figure, a unit and a place: the vocabulary's label with the stored id or key beside
// it, so a reader can find it in the JSON. Shared by every report renderer; pure functions.
import { whereText } from "../compare/metricText.ts";
import type { ComparisonMetric } from "../contract/comparison.ts";
import {
  FIELD_ANGLE_QUANTITIES,
  FIELD_FRACTION_QUANTITIES,
  FIELD_UNIT,
  checkTitle,
  metricLabel,
  quantityLabel,
  unitLabel,
} from "../vocabulary/index.ts";

/** A check's title with its stored id after a dash: `Ray trace — \`r2\``; the id alone where it has no title. */
export function checkName(id: string): string {
  const title = checkTitle(id);
  return title === id ? `\`${id}\`` : `${title} — \`${id}\``;
}

/** A figure's label with its stored key after a dash; the key alone where the vocabulary has no label. */
export function figureName(name: string): string {
  const label = metricLabel(name);
  return label === name ? `\`${name}\`` : `${label} — \`${name}\``;
}

/** A quantity's label, as said in the middle of a sentence, with its stored name. */
export function quantityName(name: string): string {
  const label = quantityLabel(name);
  const said = /^[A-Z][a-z]/.test(label) ? `${label[0].toLowerCase()}${label.slice(1)}` : label;
  return label === name ? `\`${name}\`` : `${said} (\`${name}\`)`;
}

/** A unit as a report shows it (`unitLabel`): `(no unit)` for a pure number, `wavelengths` for a count of lines. */
export function unitName(unit: string): string {
  return unitLabel(unit);
}

/**
 * Where a metric occurs, as words, as `whereText` gives them, with the unit of a field: degrees for a field angle
 * (`FIELD_ANGLE_QUANTITIES`), "of the image height" for the fraction an MTF request states (`FIELD_FRACTION_QUANTITIES`).
 * Empty for a metric that occurs nowhere.
 */
export function placeText(where: ComparisonMetric["where"], quantity: string): string {
  const said = whereText(where).replace(/^ at /, "");
  const unit = FIELD_ANGLE_QUANTITIES.includes(quantity)
    ? FIELD_UNIT.angle
    : FIELD_FRACTION_QUANTITIES.includes(quantity)
      ? FIELD_UNIT.requested
      : null;
  if (said === "" || unit === null) return said;
  return said.replace(/(^|, )field ([^,]+)/, `$1field $2 ${unit}`);
}
