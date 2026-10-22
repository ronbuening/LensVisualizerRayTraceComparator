// The comparator of `rays.trace` for rung R6a: the wave MTF of the same rays in two engines. One estimator, the
// comparator's own (src/estimators/waveOtf.ts: Hopkins' autocorrelation of the pupil function, from optical paths),
// is applied to each engine's trace of the rays of a field, on the rays both engines bring to the image, about one
// reference point, at the frequencies of the run's MTF recipe; the two curves are then set against each other.
//
// A field has its rays on two lattices, the run's own and one of twice as many cells across, each at every line of
// the case, and every one of those sets is a request of its own: the comparator is one of spans (`spanOf`), and
// each of its answers is an engine's traces of a field on every lattice at every line. The figure that is judged
// is of the finer lattice. Whether that lattice can carry it is the estimator's own statement and is looked at
// before anything is judged: where neighbouring cells are more than a quarter wave apart, or the estimate moves by
// more than the band of its field from the coarser lattice to the finer (`waveFlags`), the figure is written down
// under another name and judged by nothing.
import type { ComparisonMetric } from "../contract/comparison.ts";
import type { JsonObject } from "../contract/json.ts";
import { RAYS_TRACE, RAY_STATUS } from "../contract/quantities/raysTrace.ts";
import type { RayLattice, RaysTraceSpec } from "../contract/quantities/raysTrace.ts";
import { waveFrequencies } from "../core/mtfRecipe.ts";
import { canonicalJson } from "../core/numeric/canonicalJson.ts";
import { countValid, intersectValidity, maskWhere } from "../estimators/validity.ts";
import { convergenceLimit, waveFlags } from "../estimators/waveValidity.ts";
import { QUARTER_WAVE, gridConvergence } from "../estimators/waveOtf.ts";
import type {
  GridConvergence,
  PolychromaticWaveOtf,
  ReferencePoint,
  WaveOtfUnavailable,
} from "../estimators/waveOtf.ts";
import { decodeWavefront, fieldWaveOtf, fluxCentroid, imageSpaceIndices, launchedSet } from "../rays/wavefront.ts";
import type { DecodedWavefront, LaunchedSet } from "../rays/wavefront.ts";
import type { ComparatorOutcome, ComparisonContext, ComputedMetric, QuantityComparator } from "./comparator.ts";
import { numberText } from "./metricText.ts";
import { MTF_CUTS } from "./raysMtf.ts";
import type { SpanAnswer, SpanMember } from "./span.ts";

/**
 * The reasons of the estimator that are no defect of an answer: two answers with nothing to take a transfer
 * function of (no ray of a line is ok in both, or none that carries flux), and a bundle the estimator cannot lay
 * out as a pupil (its lit cells on one line, or a map from cells to cosines that folds). The figure is then not
 * measured. Any other reason is a defect of an answer or of the request, and the two are not comparable.
 */
const NOTHING_TO_MEASURE: readonly WaveOtfUnavailable["reason"][] = ["no-rays", "no-flux", "degenerate-pupil"];

/**
 * The rays of a field: every set that states its field and a lattice is of the span of that field, whichever
 * lattice and line it is of. A set without a lattice has no pupil to lay out and is a span of its own.
 */
function spanOf(spec: JsonObject): string | undefined {
  const { groups } = spec as RaysTraceSpec;
  return groups?.field === undefined || groups.lattice === undefined ? undefined : canonicalJson(groups.field);
}

/** One line of a field on one lattice, as two engines traced it. */
interface TracedLine {
  /** What the request says of the rays: the line, the flux of each and its launch path. */
  readonly set: LaunchedSet;
  readonly a: DecodedWavefront;
  readonly b: DecodedWavefront;
  /** The rays that are ok in both answers: the only ones either engine's sum takes. */
  readonly valid: Uint8Array;
}

/** One lattice of a field: its sets at the lines of the case, in the order of the lines. */
interface TracedGrid {
  readonly lattice: RayLattice;
  readonly lines: TracedLine[];
}

/**
 * Why a lattice is no arbiter, in words: each flag of `waveFlags` with the figure that raised it. Empty for a
 * lattice that is one. `withoutCoarser` says why there is no convergence figure, where there is none.
 */
export function waveFlagTexts(
  lattice: { readonly columns: number; readonly onAxis: boolean },
  phaseStepWaves: number,
  convergence: number | null,
  withoutCoarser = "the field has rays on one lattice only",
): string[] {
  const { columns, onAxis } = lattice;
  return waveFlags(phaseStepWaves, convergence, onAxis).map((flag) => {
    if (flag === "undersampled") {
      return (
        `undersampled: neighbouring cells of the lattice of ${columns} columns are ${numberText(phaseStepWaves)} ` +
        `waves apart, above ${numberText(QUARTER_WAVE)}`
      );
    }
    if (flag === "convergence-unknown") return `convergence unknown: ${withoutCoarser}`;
    return (
      `not converged: the estimate moves by ${numberText(convergence as number)} from the coarser lattice to the ` +
      `one of ${columns} columns, above ${numberText(convergenceLimit(onAxis))}`
    );
  });
}

/** The cells of a lattice: what orders the lattices of a field from coarse to fine. */
function cellsOf(lattice: RayLattice): number {
  return lattice.columns * lattice.rows;
}

/** What two answers were measured to, and under which context. */
interface Measured {
  readonly context: ComparisonContext | undefined;
  readonly outcome: ComparatorOutcome;
}

/**
 * The outcomes already measured, by the two answers as objects: a comparison pairs the same answers once for each
 * of its modes, under one context, and a wave transfer function is the costliest figure a comparator takes.
 */
const MEASURED = new WeakMap<JsonObject, WeakMap<JsonObject, Measured>>();

function compare(dataA: JsonObject, dataB: JsonObject, context?: ComparisonContext): ComparatorOutcome {
  const known = MEASURED.get(dataA)?.get(dataB);
  if (known !== undefined && known.context === context) return known.outcome;
  const outcome = measure(dataA, dataB, context);
  const ofA = MEASURED.get(dataA) ?? new WeakMap<JsonObject, Measured>();
  ofA.set(dataB, { context, outcome });
  MEASURED.set(dataA, ofA);
  return outcome;
}

function measure(dataA: JsonObject, dataB: JsonObject, context?: ComparisonContext): ComparatorOutcome {
  const never = (reason: string): ComparatorOutcome => ({ comparable: false, reason });
  const [membersA, membersB] = [(dataA as Partial<SpanAnswer>).members, (dataB as Partial<SpanAnswer>).members];
  if (membersA === undefined || membersB === undefined) {
    return never("the set states no field or no lattice: a wave transfer function is of the lattice of a field");
  }
  const recipe = context?.recipe;
  const opticalCase = context?.opticalCase;
  if (recipe === undefined || opticalCase === undefined) {
    return never(
      "the MTF recipe of the run and its case are not at hand: the recipe's frequencies say where the MTF is taken, " +
        "and the case what each line counts for, its wavelength and the index of the image space",
    );
  }
  const { conditions } = opticalCase;
  if (recipe.imageZ !== conditions.imageZ) {
    return never(
      `the recipe is of the plane z = ${recipe.imageZ} mm, and the rays land on z = ${conditions.imageZ} mm`,
    );
  }
  if (recipe.frequenciesPerMm.length === 0) return never("the recipe states no frequency");
  const frequencies = waveFrequencies(recipe.frequenciesPerMm);
  if (
    membersA.length !== membersB.length ||
    membersA.some((member, index) => member.requestId !== membersB[index].requestId)
  ) {
    return never("the two answers are to different requests");
  }

  // The lattices of the field, each with its sets at the lines of the case.
  const grids = new Map<string, TracedGrid>();
  for (const [index, member] of membersA.entries()) {
    const spec = member.spec as RaysTraceSpec;
    const lattice = spec.groups?.lattice as RayLattice;
    const [a, b] = [decodeWavefront(member.data), decodeWavefront((membersB[index] as SpanMember).data)];
    const set = launchedSet(spec, opticalCase);
    const { weights } = set;
    if (a.rays !== b.rays || a.rays !== weights.length) {
      return never(
        `line ${spec.line}: the request is of ${weights.length} rays, and the answers are for ${a.rays} and ${b.rays}`,
      );
    }
    if (cellsOf(lattice) > weights.length) {
      return never(
        `line ${spec.line}: the set states a lattice of ${lattice.columns} by ${lattice.rows} cells and holds ` +
          `${weights.length} rays`,
      );
    }
    const valid = intersectValidity([maskWhere(a.status, RAY_STATUS.ok), maskWhere(b.status, RAY_STATUS.ok)]);
    const key = canonicalJson(lattice);
    const grid = grids.get(key) ?? { lattice, lines: [] };
    grid.lines.push({ set, a, b, valid });
    grids.set(key, grid);
  }
  // From coarse to fine: by cells, and of two lattices of as many cells the one of the larger step first.
  const ordered = [...grids.values()].sort(
    (first, second) => cellsOf(first.lattice) - cellsOf(second.lattice) || second.lattice.step - first.lattice.step,
  );
  for (const { lattice, lines } of ordered) {
    lines.sort((first, second) => first.set.line - second.set.line);
    const stated = lines.map(({ set }) => set.line);
    if (stated.length !== conditions.lines.length || stated.some((line, index) => line !== index)) {
      return never(
        `the lattice of ${lattice.columns} columns has rays at the lines ${stated.join(", ")}, and the case has ` +
          `${conditions.lines.length} lines: a spectrum from which a line is missing, or is there twice, is another ` +
          "spectrum",
      );
    }
  }
  const fine = ordered[ordered.length - 1];
  const coarse = ordered.length > 1 ? ordered[ordered.length - 2] : undefined;

  // What was compared on the lattice that is judged, and what was left out of both sums.
  let compared = 0;
  let dropped = 0;
  let firstDropped: ComparisonMetric["where"];
  for (const { set, a, b, valid } of fine.lines) {
    compared += countValid(valid);
    for (let ray = 0; ray < a.rays; ray++) {
      if ((a.status[ray] === RAY_STATUS.ok) === (b.status[ray] === RAY_STATUS.ok)) continue;
      if (dropped++ === 0) firstDropped = { line: set.line, ray };
    }
  }
  const angle = (membersA[0].spec as RaysTraceSpec).groups?.field?.angleDeg;
  const place: NonNullable<ComparisonMetric["where"]> = angle === undefined ? {} : { field: angle };
  const counts: ComputedMetric[] = [
    { name: "lattice.columns", value: fine.lattice.columns },
    { name: "rays.compared", value: compared },
    {
      name: "rays.dropped",
      value: dropped,
      ...(firstDropped === undefined ? {} : { where: { ...place, ...firstDropped } }),
    },
    { name: "lines.compared", value: fine.lines.length },
  ];
  const unmeasured = (reason: string, metrics: readonly ComputedMetric[] = counts): ComparatorOutcome => ({
    comparable: true,
    metrics,
    unmeasured: [{ name: "waveMtf.maxAbs", reason }],
  });

  const indices = imageSpaceIndices(opticalCase);
  type Estimates = { a: PolychromaticWaveOtf | WaveOtfUnavailable; b: PolychromaticWaveOtf | WaveOtfUnavailable };
  // Both engines' estimates on one lattice, or null where line 0 has no flux that both engines land. One reference
  // point for both engines and every line: midway between where each engine puts the centre of the first line's
  // flux. The modulus does not depend on it; the step from cell to cell does, so the point is amid the spot.
  const estimatesOn = (grid: TracedGrid): Estimates | null => {
    const [first] = grid.lines;
    const [centreA, centreB] = [
      fluxCentroid(first.a, first.set.weights, first.valid),
      fluxCentroid(first.b, first.set.weights, first.valid),
    ];
    if (centreA === null || centreB === null) return null;
    const reference: ReferencePoint = {
      x: (centreA.x + centreB.x) / 2,
      y: (centreA.y + centreB.y) / 2,
      z: conditions.imageZ,
    };
    const estimate = (side: "a" | "b"): PolychromaticWaveOtf | WaveOtfUnavailable => {
      const lines = grid.lines.map((each) => ({ set: each.set, trace: each[side], valid: each.valid }));
      return fieldWaveOtf(opticalCase, indices, grid.lattice, lines, reference, frequencies);
    };
    return { a: estimate("a"), b: estimate("b") };
  };

  const judged = estimatesOn(fine);
  if (judged === null) return unmeasured("no ray of line 0 that carries flux is ok in both answers");
  const missing = [judged.a, judged.b].find((otf): otf is WaveOtfUnavailable => !otf.available);
  if (missing !== undefined) {
    const said = `${missing.reason}: ${missing.message}`;
    return NOTHING_TO_MEASURE.includes(missing.reason)
      ? unmeasured(said)
      : never(`the estimator has no value: ${said}`);
  }
  const [otfA, otfB] = [judged.a as PolychromaticWaveOtf, judged.b as PolychromaticWaveOtf];

  let worst: ComputedMetric = { name: "waveMtf.maxAbs", value: -1 };
  for (const cut of MTF_CUTS) {
    const [curveA, curveB] = [otfA[cut].modulus, otfB[cut].modulus];
    frequencies.forEach((frequencyPerMm, index) => {
      const value = Math.abs(curveA[index] - curveB[index]);
      // The first of equal values is kept; no modulus of an available estimate is a NaN.
      if (value > worst.value) worst = { name: "waveMtf.maxAbs", value, where: { ...place, cut, frequencyPerMm } };
    });
  }

  // The larger step of the two estimates, with the line and the ray it is at.
  const stepped = otfB.phaseStep.waves > otfA.phaseStep.waves ? otfB.phaseStep : otfA.phaseStep;
  const phaseStep: ComputedMetric = {
    name: "phaseStep.waves",
    value: stepped.waves,
    ...(stepped.ray < 0 ? {} : { where: { ...place, line: stepped.line ?? 0, ray: stepped.ray } }),
  };

  // How far each engine's estimate moves from the coarser lattice to the judged one: the larger of the two.
  let moved: (GridConvergence & { readonly frequencyPerMm: number }) | null = null;
  let withoutCoarser: string | undefined;
  if (coarse !== undefined) {
    const before = estimatesOn(coarse);
    const lacking =
      before === null ? undefined : [before.a, before.b].find((otf): otf is WaveOtfUnavailable => !otf.available);
    if (before === null) withoutCoarser = "no ray of line 0 that carries flux is ok in both answers on the coarser";
    else if (lacking !== undefined) {
      if (!NOTHING_TO_MEASURE.includes(lacking.reason)) {
        return never(`the estimator has no value on the coarser lattice: ${lacking.reason}: ${lacking.message}`);
      }
      withoutCoarser = `the coarser lattice has no estimate (${lacking.reason})`;
    } else {
      for (const [from, to] of [
        [before.a as PolychromaticWaveOtf, otfA],
        [before.b as PolychromaticWaveOtf, otfB],
      ] as const) {
        const figure = gridConvergence(from, to);
        if (moved === null || figure.maxAbs > moved.maxAbs) {
          moved = { ...figure, frequencyPerMm: frequencies[figure.frequency] };
        }
      }
    }
  }
  const convergence: ComputedMetric[] =
    moved === null
      ? []
      : [
          {
            name: "convergence.maxAbs",
            value: moved.maxAbs,
            where: { ...place, cut: moved.cut, frequencyPerMm: moved.frequencyPerMm },
          },
        ];

  const flags = waveFlagTexts(
    { columns: fine.lattice.columns, onAxis: angle === 0 },
    stepped.waves,
    moved?.maxAbs ?? null,
    withoutCoarser,
  );
  const shown = [phaseStep, ...convergence, ...counts];
  if (flags.length === 0) return { comparable: true, metrics: [worst, ...shown] };
  const figure: ComputedMetric = { ...worst, name: "waveMtf.flagged" };
  return unmeasured(
    `the lattice is no arbiter (${flags.join("; ")}): the figure ${numberText(worst.value)} is recorded as ` +
      "waveMtf.flagged and not judged",
    [figure, ...shown],
  );
}

/**
 * The comparator of `rays.trace` for rung R6a: the wave MTF of the same rays in two engines, by the comparator's
 * own estimator (`polychromaticWaveOtf`).
 *
 * It is a comparator of spans: the sets of one field on every lattice and at every line of the case are compared
 * as one (`spanOf`: the sets that state the same field, and a lattice), and each answer is a `SpanAnswer`.
 *
 * - **The lattices** of a field are told apart by what the sets state (`groups.lattice`). The finest is the one
 *   the figure is of; the next coarser one says whether it has converged. A field with one lattice has a figure
 *   and no convergence.
 * - **The rays** of each line are the ones that are ok in both answers: a ray one engine did not bring to the
 *   image is in neither engine's pupil. Which rays those are is rung R2's to judge.
 * - **What is read** of a request, of an answer and of the case is what `fieldWaveOtf` reads (src/rays/wavefront.ts):
 *   the landing with the path to it and the direction there, the weights and the launch paths, the lines and the
 *   index of the image space.
 * - **The reference point** is one for both engines and every line, on the image plane of the case: midway between
 *   the two engines' flux-weighted centroids of the first line's rays on that lattice. The modulus does not depend
 *   on it; the step of the path from cell to cell does, and it is smallest amid the spot.
 * - **The frequencies** are the recipe's, thinned to at most `MAX_WAVE_FREQUENCIES` (`waveFrequencies`), and the
 *   plane is the case's, which is the recipe's.
 *
 * An outcome is kept for the two answers and the context it was made of, as objects: the two modes of a comparison
 * hand over the same ones, and the second is not computed again.
 *
 * Metrics:
 *
 * - `waveMtf.maxAbs`: the largest difference of the two wave MTFs on the finest lattice, over both cuts and every
 *   frequency, with the `field` angle in degrees, the `cut` and the `frequencyPerMm` in `where`, the first on a
 *   tie. It is reported, and so judged, only where the lattice is an arbiter (`waveFlags`): its cells are within
 *   a quarter wave of their neighbours in both estimates, and neither estimate moved by more than the band of the
 *   field (`CONVERGENCE_BANDS`: 0.005 on the axis, 0.01 off it) from the coarser lattice;
 * - `waveMtf.flagged`: the same figure where the lattice is no arbiter. It is no metric of the policy: it is
 *   written down, `waveMtf.maxAbs` is not measured, and the reason says which fact flagged it;
 * - `phaseStep.waves`: the largest step of the path between neighbouring lit cells of the finest lattice, in waves
 *   of its line, of either engine's estimate, with the `line` and the `ray` in `where`;
 * - `convergence.maxAbs`: the largest difference between the wave MTF of the finest lattice and that of the next
 *   coarser one, of either engine, with the `cut` and the `frequencyPerMm`. Left out where the field has one
 *   lattice, or the coarser has no estimate;
 * - `lattice.columns`: the columns of the finest lattice;
 * - `rays.compared`, `rays.dropped`, `lines.compared`: as rung R4 counts them, on the finest lattice.
 *
 * Not measured: where no ray of a line is ok in both, none carries flux, or the lit cells cannot be laid out as a
 * pupil. Not comparable: a set that states no field or no lattice; without the run's recipe or its case; a recipe
 * of another plane than the case's, or without a frequency; answers to different requests or for other numbers of
 * rays than the request has; a lattice whose sets are not of every line of the case, each once; and whatever else
 * leaves the estimator without a value (a ray that is ok and has a point, a direction or a path that is no finite
 * number).
 */
export const raysWaveMtfComparator: QuantityComparator = Object.freeze({
  quantity: RAYS_TRACE,
  rung: "r6a",
  metrics: Object.freeze([
    { name: "waveMtf.maxAbs", unit: "1" },
    { name: "waveMtf.flagged", unit: "1" },
    { name: "phaseStep.waves", unit: "waves" },
    { name: "convergence.maxAbs", unit: "1" },
    { name: "lattice.columns", unit: "cells" },
    { name: "rays.compared", unit: "rays" },
    { name: "rays.dropped", unit: "rays" },
    { name: "lines.compared", unit: "lines" },
  ]),
  spanOf,
  compare,
});
