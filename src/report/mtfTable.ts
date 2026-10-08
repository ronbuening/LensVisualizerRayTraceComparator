// One engine's `mtf.native` answer as a table for people: a row per field at the frequencies that are shown, then
// what the engine says of the plane, the aperture and the light it computed with. Pure: equal inputs, equal text.
import type { OpticalCase } from "../contract/case.ts";
import type { MtfNativeData, MtfNativeSpec } from "../contract/quantities/mtfNative.ts";
import { formatFixed } from "../core/numeric/format.ts";
import { decodeNdArray } from "../core/numeric/ndarray.ts";
import type { NdArrayWire } from "../core/numeric/ndarray.ts";

/** What a table is made from. */
export interface MtfTableInput {
  /** The spec of the request: its frequencies say which element of a curve is which. */
  readonly spec: MtfNativeSpec;
  readonly data: MtfNativeData;
  /** The frequencies to show, cycles/mm, each one of the spec's. */
  readonly displayedFrequenciesPerMm: readonly number[];
  /** The case of the request, for the label of a surface the answer names by its index. */
  readonly opticalCase?: OpticalCase;
}

/** One field of a table: its curves at the shown frequencies, in their order; null where the answer holds a NaN. */
export interface MtfTableRow {
  readonly field: number;
  readonly imageHeightMm: number | null;
  readonly fieldAngleDeg: number | null;
  readonly status: string;
  readonly reason?: string;
  readonly sagittal: readonly (number | null)[];
  readonly tangential: readonly (number | null)[];
}

/** What a table shows where an answer has no number. */
const NONE = "-";
const MTF_DECIMALS = 4;
const LENGTH_DECIMALS = 3;

function curveOf(wire: NdArrayWire): ArrayLike<number> {
  return decodeNdArray(wire).values;
}

/**
 * The fields of an answer at the frequencies to show. Throws when one of those is not a frequency of the spec, or
 * when a curve does not have one value per frequency of the spec: then the answer is not one to that request.
 */
export function mtfTableRows(input: MtfTableInput): MtfTableRow[] {
  const { spec, data, displayedFrequenciesPerMm } = input;
  const columns = displayedFrequenciesPerMm.map((frequency) => {
    const at = spec.frequenciesPerMm.indexOf(frequency);
    if (at < 0) throw new Error(`${frequency} cycles/mm is to be shown and is not a frequency of the request`);
    return at;
  });
  return data.fields.map((field) => {
    const pick = (wire: NdArrayWire): (number | null)[] => {
      const curve = curveOf(wire);
      if (curve.length !== spec.frequenciesPerMm.length) {
        const asked = spec.frequenciesPerMm.length;
        throw new Error(`a curve of the field ${field.field} has ${curve.length} values for ${asked} frequencies`);
      }
      return columns.map((at) => (Number.isNaN(curve[at]) ? null : curve[at]));
    };
    return {
      field: field.field,
      imageHeightMm: field.imageHeightMm,
      fieldAngleDeg: field.fieldAngleDeg,
      status: field.status,
      ...(field.reason === undefined ? {} : { reason: field.reason }),
      sagittal: pick(field.sagittal),
      tangential: pick(field.tangential),
    };
  });
}

/** Rows of cells as lines of columns two spaces apart; a column of `rightAligned` is padded on the left. */
function columnsText(rows: readonly (readonly string[])[], rightAligned: ReadonlySet<number>): string[] {
  const widths = rows[0].map((_cell, column) => Math.max(...rows.map((row) => row[column].length)));
  return rows.map((row) =>
    row
      .map((cell, column) => (rightAligned.has(column) ? cell.padStart(widths[column]) : cell.padEnd(widths[column])))
      .join("  ")
      .trimEnd(),
  );
}

function fixedOrNone(value: number | null, decimals: number): string {
  return value === null ? NONE : formatFixed(value, decimals);
}

/** A number with its sign said, so that a shift toward the lens and one away from it read apart. */
function signed(value: number, decimals: number): string {
  const text = formatFixed(value, decimals);
  return value > 0 && /[1-9]/.test(text) ? `+${text}` : text;
}

/** A value of an open map as text: a number or a string as it is, a list of them with spaces between. */
function valueText(value: unknown): string | null {
  if (typeof value === "number" || typeof value === "string" || typeof value === "boolean") return String(value);
  if (Array.isArray(value) && value.every((member) => typeof member === "number" || typeof member === "string")) {
    return value.join(" ");
  }
  return null;
}

/** What an answer recorded of its aperture, in words: the traced f-number and the limiting surface, then the rest. */
function apertureText(aperture: MtfNativeData["aperture"], opticalCase: OpticalCase | undefined): string {
  const parts: string[] = [];
  for (const name of Object.keys(aperture).sort()) {
    const value = aperture[name];
    if (name === "tracedFNumber") parts.unshift(`traced f/${formatFixed(value, MTF_DECIMALS)}`);
    else if (name === "limitingSurfaceIndex") {
      const surface = opticalCase?.system.surfaces[value];
      const stop = opticalCase?.system.stopIndex === value ? ", the stop" : "";
      parts.push(
        surface === undefined ? `limited by surface index ${value}` : `limited by surface ${surface.label}${stop}`,
      );
    } else parts.push(`${name} ${value}`);
  }
  return parts.length === 0 ? NONE : parts.join(", ");
}

/**
 * The table of one answer, as lines that each end in a newline:
 *
 * - a row per field: the field as it was asked for, the image height in mm, the field angle in degrees, the status
 *   and, for each frequency that is shown, the sagittal (S) and the tangential (T) value; then the engine's reason,
 *   where a field states one. A value the answer does not have is `-`;
 * - `method`: the engine's name for it, and its parameters that are numbers, texts or lists of them, by name;
 * - `focus`: the plane the engine applied and its shift from the image plane of the case, in mm;
 * - `aperture`: what the engine recorded: its traced f-number and the surface that limits the axial beam, by its
 *   label in the case when one is given, and whatever else it recorded by name;
 * - `lines`: the wavelengths the engine computed with, each with its weight;
 * - `note`: each note of the answer.
 */
export function mtfTableText(input: MtfTableInput): string {
  const { data, displayedFrequenciesPerMm, opticalCase } = input;
  const rows = mtfTableRows(input);
  const withReason = rows.some((row) => row.reason !== undefined);
  const header = [
    "field",
    "height mm",
    "angle deg",
    "status",
    ...displayedFrequenciesPerMm.flatMap((frequency) => [`S ${frequency}`, `T ${frequency}`]),
    ...(withReason ? ["reason"] : []),
  ];
  const cells = rows.map((row) => [
    String(row.field),
    fixedOrNone(row.imageHeightMm, LENGTH_DECIMALS),
    fixedOrNone(row.fieldAngleDeg, LENGTH_DECIMALS),
    row.status,
    ...row.sagittal.flatMap((value, at) => [
      fixedOrNone(value, MTF_DECIMALS),
      fixedOrNone(row.tangential[at], MTF_DECIMALS),
    ]),
    ...(withReason ? [row.reason ?? ""] : []),
  ]);
  const numeric = new Set([1, 2, ...displayedFrequenciesPerMm.flatMap((_frequency, at) => [4 + 2 * at, 5 + 2 * at])]);

  const params = Object.keys(data.method.params)
    .sort()
    .flatMap((name) => {
      const text = valueText(data.method.params[name]);
      return text === null ? [] : [`${name} ${text}`];
    });
  const facts: string[][] = [
    ["method", data.method.name],
    ...params.map((param) => ["", param]),
    ["focus", `${data.focus.mode}, shift ${signed(data.focus.appliedShiftMm, MTF_DECIMALS)} mm`],
    ["aperture", apertureText(data.aperture, opticalCase)],
    ["lines", data.lines.map((line) => `${line.wavelengthNm} nm (${line.weight})`).join(", ")],
    ...data.notes.map((note) => ["note", note]),
  ];
  return [...columnsText([header, ...cells], numeric), "", ...columnsText(facts, new Set()), ""].join("\n");
}
