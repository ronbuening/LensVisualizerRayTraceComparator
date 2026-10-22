// The table of the rungs R5 and R5g: LensVisualizer's MTF beside optiland's own and an estimator of the comparator's
// (in R5 the product MTF, optiland's FFT MTF and the wave estimator; in R5g the geometric MTF of each and the
// estimator on a replay of LensVisualizer's sampling), field by field, cut by cut and frequency by frequency, with the class of every difference. It is built from what
// a comparison states (the values each participant's answer records, the pair of the two engines, the bands of the
// policy) and from nothing else: no answer is read here, so the same table can be made from any record that keeps
// those. Pure: equal inputs, an equal table.
import { stepValueName } from "../compare/group.ts";
import {
  CHIEF_LANDING_METRIC,
  MTF_CUTS,
  OFF_AXIS_METRIC,
  ON_AXIS_METRIC,
  classifyNativeField,
  curveValueName,
  factsOfRecorded,
  sameWavelengths,
} from "../compare/mtfNative.ts";
import type { MtfCut, NativeDifferenceClass, NativeFieldReason } from "../compare/mtfNative.ts";
import type { RecordedValues, Verdict } from "../contract/comparison.ts";
import type { RungPolicy } from "../contract/policy.ts";
import type { MtfComparisonKind, MtfRowStatus } from "./wording.ts";

/** The two engines the difference of a row is of, the first minus the second. */
export const MTF_COMPARISON_PAIR = ["lv", "optiland"] as const;

/** The frequencies a report shows, cycles/mm; the model holds every frequency of the request. */
export const MTF_SHOWN_FREQUENCIES: readonly number[] = Object.freeze([10, 30, 50]);

/** What a table is made from: a comparison set as far as it is read. */
export interface MtfComparisonInput {
  readonly participants: readonly {
    readonly engine: string;
    readonly status: string;
    readonly recorded?: RecordedValues;
  }[];
  /** The pairs of the request, in any mode; the one of `MTF_COMPARISON_PAIR` is looked up, in either order. */
  readonly pairs: readonly {
    readonly a: string;
    readonly b: string;
    readonly verdict: Verdict;
    readonly reason?: string;
  }[];
  /** The policy of the rung: its bands. */
  readonly policy: RungPolicy | null;
  /** Which MTF the rung sets side by side; the diffraction MTF where it is left out. */
  readonly kind?: MtfComparisonKind;
}

/** One column of the table: an engine's answer, or a later step of one. */
export interface MtfComparisonColumn {
  readonly engine: string;
  /** The step of the engine the column is of; null for its first answer. */
  readonly step: string | null;
  /** True for the two columns the difference of a row is of. */
  readonly judged: boolean;
}

/** What a column says of one field: it stands by it, it does not, it has no curve; null where it did not answer. */
export type MtfFieldFlag = "ok" | "unconverged" | "no curve";

/** One field of the request. */
export interface MtfComparisonField {
  /** The field as it was requested. */
  readonly field: number;
  /** The angle the first engine of the pair computed with, degrees; null where it states none. */
  readonly fieldAngleDeg: number | null;
  /** One per column. */
  readonly flags: readonly (MtfFieldFlag | null)[];
  /**
   * What each column states of its sampling of the field: how many cells or rays across (`gridSize`, or `numRays`
   * for an engine that states no grid), and how far its curves moved between its last two samplings (`maxDelta`).
   * One per column; null where the column states none.
   */
  readonly samplings: readonly { readonly across: number | null; readonly lastChange: number | null }[];
  /** How far apart the chief rays of the two judged columns land, mm; null where one does not say. */
  readonly chiefLandingMm: number | null;
  /**
   * What the judged columns say of the rim rays an engine calibrates its frequency axes with: how many were lost,
   * and the largest distance on the image plane from the chief ray to one of them, mm. The larger of the two
   * columns' values; null where neither states one.
   */
  readonly rimRaysLost: number | null;
  readonly rimLandingSpreadMm: number | null;
  /** The class and the reason of the field's difference; null where the two engines were not compared. */
  readonly class: NativeDifferenceClass | null;
  readonly reason: NativeFieldReason | null;
}

/** One row: one field, cut and frequency. */
export interface MtfComparisonRow {
  readonly field: number;
  readonly cut: MtfCut;
  readonly frequencyPerMm: number;
  /** True for a frequency a report shows (`MTF_SHOWN_FREQUENCIES`). */
  readonly shown: boolean;
  /** The MTF value of each column; null where it has none. */
  readonly values: readonly (number | null)[];
  /** The first judged column minus the second; null where the field shows no difference or a value is missing. */
  readonly difference: number | null;
  /** The attention band the difference is held to; null for a row in no band. */
  readonly band: number | null;
  readonly status: MtfRowStatus;
  readonly class: NativeDifferenceClass | null;
}

/** The table of one request of rung R5 or R5g. */
export interface MtfComparison {
  /** Which MTF the table is of: the diffraction MTF of R5, the geometric MTF of R5g. */
  readonly kind: MtfComparisonKind;
  /**
   * How many lines each of the two judged columns says its answer is of, in the order of the pair; null for a
   * column that did not answer.
   */
  readonly lineCounts: readonly (number | null)[];
  /** The two engines the differences are of, their verdict as a pair and its reason; null verdict without a pair. */
  readonly pair: { readonly a: string; readonly b: string; readonly verdict: Verdict | null; readonly reason?: string };
  readonly columns: readonly MtfComparisonColumn[];
  /** The bands of the policy: on the axis, off it, and how far apart two chief rays may land, mm. */
  readonly bands: {
    readonly onAxis: number | null;
    readonly offAxis: number | null;
    readonly chiefLandingMm: number | null;
  };
  readonly fields: readonly MtfComparisonField[];
  /** Fields in the order of the request, then the cuts, then the frequencies ascending. */
  readonly rows: readonly MtfComparisonRow[];
}

function valueAt(recorded: RecordedValues | undefined, name: string, index: number): number | null {
  if (recorded === undefined || !Object.hasOwn(recorded, name)) return null;
  return recorded[name][index] ?? null;
}

/** The recorded values of one column: those of the engine's first answer, or of a step under their own names. */
function columnValues(recorded: RecordedValues | undefined, step: string | null): RecordedValues | undefined {
  if (recorded === undefined || step === null) return recorded;
  const suffix = stepValueName("", step);
  return Object.fromEntries(
    Object.keys(recorded)
      .filter((name) => name.endsWith(suffix))
      .map((name) => [name.slice(0, -suffix.length), recorded[name]]),
  );
}

/** The steps an engine's recorded values hold, in sorted order. */
function stepsOf(recorded: RecordedValues | undefined): string[] {
  const steps = Object.keys(recorded ?? {}).flatMap((name) =>
    name.includes("#") ? [name.slice(name.indexOf("#") + 1)] : [],
  );
  return [...new Set(steps)].sort();
}

/**
 * The table of one request, or null where the comparison is none of an MTF: no participant records the fields of
 * an `mtf.native` answer.
 *
 * The columns are the first engine of the pair, the second, each later step of an engine after its first answer,
 * and every other participant in the order given. The differences are of the two engines of `MTF_COMPARISON_PAIR`,
 * each at its last step, the first minus the second.
 *
 * A field is sorted as the comparator sorts it (`classifyNativeField`), from the recorded values. A row is
 * `UNSUPPORTED` where the pair is, or the field has no curve from one of the two; `ERROR` where the pair is, or
 * there is no pair; `RECORDED` or `ATTENTION` where the field is in a band, by the band of the policy; and
 * `SET ASIDE` for every other row, whose difference is shown only where the two answers are of one image point.
 */
export function buildMtfComparison(input: MtfComparisonInput): MtfComparison | null {
  const { participants, policy } = input;
  const [first, second] = MTF_COMPARISON_PAIR;
  const fieldsOf = (engine: string): readonly (number | null)[] | undefined =>
    participants.find((participant) => participant.engine === engine)?.recorded?.field;
  const fields = fieldsOf(first) ?? fieldsOf(second) ?? participants.map((p) => p.recorded?.field).find((f) => f);
  if (fields === undefined) return null;

  const ordered = [first, second, ...participants.map((p) => p.engine).filter((id) => id !== first && id !== second)];
  const columns: (MtfComparisonColumn & { readonly values: RecordedValues | undefined })[] = [];
  for (const engine of ordered) {
    const participant = participants.find((candidate) => candidate.engine === engine);
    if (participant === undefined) continue;
    const steps = [null, ...stepsOf(participant.recorded)];
    for (const step of steps) {
      const judged = (engine === first || engine === second) && step === steps.at(-1);
      columns.push({ engine, step, judged, values: columnValues(participant.recorded, step) });
    }
  }
  const [a, b] = [first, second].map((engine) => columns.find((column) => column.engine === engine && column.judged));
  const pair = input.pairs.find(
    (candidate) =>
      (candidate.a === first && candidate.b === second) || (candidate.a === second && candidate.b === first),
  );
  const band = (name: string): number | null => policy?.metrics[name]?.attention ?? null;
  const bands = {
    onAxis: band(ON_AXIS_METRIC),
    offAxis: band(OFF_AXIS_METRIC),
    chiefLandingMm: band(CHIEF_LANDING_METRIC),
  };
  const compared = pair !== undefined && pair.verdict !== "UNSUPPORTED" && pair.verdict !== "ERROR";
  const sorted =
    !compared || a?.values === undefined || b?.values === undefined || bands.chiefLandingMm === null
      ? null
      : { a: a.values, b: b.values, limit: bands.chiefLandingMm };
  const sameLines =
    sorted !== null && sameWavelengths(sorted.a.lineWavelengthNm ?? [], sorted.b.lineWavelengthNm ?? []);

  const frequencies = new Set<number>();
  for (const { values } of columns) {
    for (const name of Object.keys(values ?? {})) {
      if (name.startsWith(`${MTF_CUTS[0]}@`)) frequencies.add(Number(name.slice(name.indexOf("@") + 1)));
    }
  }
  const ascending = [...frequencies].filter((frequency) => !Number.isNaN(frequency)).sort((x, y) => x - y);

  const flagOf = (values: RecordedValues | undefined, index: number): MtfFieldFlag | null => {
    if (values === undefined || !Object.hasOwn(values, "settled")) return null;
    const settled = values.settled[index] ?? null;
    return settled === 1 ? "ok" : settled === 0 ? "unconverged" : "no curve";
  };
  const largest = (name: string, index: number): number | null => {
    const stated = [a, b].flatMap((column) => valueAt(column?.values, name, index) ?? []);
    return stated.length === 0 ? null : Math.max(...stated);
  };
  const outFields: MtfComparisonField[] = [];
  const rows: MtfComparisonRow[] = [];
  for (const [index, field] of fields.entries()) {
    const sorting =
      sorted === null
        ? null
        : classifyNativeField(
            factsOfRecorded(sorted.a, index),
            factsOfRecorded(sorted.b, index),
            sameLines,
            sorted.limit,
          );
    outFields.push({
      field: field ?? Number.NaN,
      fieldAngleDeg: valueAt(a?.values, "fieldAngleDeg", index) ?? valueAt(b?.values, "fieldAngleDeg", index),
      flags: columns.map(({ values }) => flagOf(values, index)),
      samplings: columns.map(({ values }) => ({
        across: valueAt(values, "gridSize", index) ?? valueAt(values, "numRays", index),
        lastChange: valueAt(values, "maxDelta", index),
      })),
      chiefLandingMm: sorting?.landingMm ?? null,
      rimRaysLost: largest("rimRaysLost", index),
      rimLandingSpreadMm: largest("rimLandingSpreadMm", index),
      class: sorting?.class ?? null,
      reason: sorting?.reason ?? null,
    });
    const rowBand = sorting?.banded !== true ? null : field === 0 ? bands.onAxis : bands.offAxis;
    for (const cut of MTF_CUTS) {
      for (const frequencyPerMm of ascending) {
        const name = curveValueName(cut, frequencyPerMm);
        const values = columns.map((column) => valueAt(column.values, name, index));
        const [valueA, valueB] = [valueAt(a?.values, name, index), valueAt(b?.values, name, index)];
        const difference = sorting?.shown === true && valueA !== null && valueB !== null ? valueA - valueB : null;
        let status: MtfRowStatus;
        if (pair === undefined || pair.verdict === "ERROR") status = "ERROR";
        else if (pair.verdict === "UNSUPPORTED" || sorting?.class === "unsupported") status = "UNSUPPORTED";
        else if (rowBand === null || difference === null) status = "SET ASIDE";
        else status = Math.abs(difference) <= rowBand ? "RECORDED" : "ATTENTION";
        rows.push({
          field: field ?? Number.NaN,
          cut,
          frequencyPerMm,
          shown: MTF_SHOWN_FREQUENCIES.includes(frequencyPerMm),
          values,
          difference,
          band: status === "RECORDED" || status === "ATTENTION" ? rowBand : null,
          status,
          class: pair?.verdict === "UNSUPPORTED" ? "unsupported" : (sorting?.class ?? null),
        });
      }
    }
  }
  return {
    kind: input.kind ?? "diffraction",
    lineCounts: [a, b].map((column) => column?.values?.lineWavelengthNm?.length ?? null),
    pair: {
      a: first,
      b: second,
      verdict: pair?.verdict ?? null,
      ...(pair?.reason === undefined ? {} : { reason: pair.reason }),
    },
    columns: columns.map(({ engine, step, judged }) => ({ engine, step, judged })),
    bands,
    fields: outFields,
    rows,
  };
}
