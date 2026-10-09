// Whether a wave transfer function estimated on a lattice may be used as an arbiter: the two facts the estimator
// states of a lattice (`waveOtf.ts`), held to their limits. It is what a rung that compares the estimate with
// another method's figure reads before it believes the estimate, and what a rung of identical rays reads before it
// judges by it.
import { QUARTER_WAVE } from "./waveOtf.ts";

/**
 * How far the wave MTF of a bundle may move from a lattice to the one of twice as many cells across, at any
 * frequency asked and in either cut, for the finer lattice to count as converged: the band within which the plan
 * holds an MTF to another method's, 0.005 for a field on the axis and 0.01 for one off it. The rim of a lattice is
 * a staircase, of first order in the cell, so what an estimate moves by on doubling is about what the finer one is
 * still off by: an estimate that moves by more than the band cannot say on which side of it another figure lies.
 */
export const CONVERGENCE_BANDS = Object.freeze({ onAxis: 0.005, offAxis: 0.01 } as const);

/** The limit of `CONVERGENCE_BANDS` for a field: on the axis, or off it. */
export function convergenceLimit(onAxis: boolean): number {
  return onAxis ? CONVERGENCE_BANDS.onAxis : CONVERGENCE_BANDS.offAxis;
}

/**
 * Why an estimate is no arbiter:
 *
 * - `undersampled`: neighbouring cells of its lattice are more than `QUARTER_WAVE` apart, so its sum may alias;
 * - `not-converged`: it moved by more than `convergenceLimit` from the coarser lattice;
 * - `convergence-unknown`: there is no estimate on a coarser lattice to hold it to.
 */
export type WaveFlag = "undersampled" | "not-converged" | "convergence-unknown";

/**
 * The flags of an estimate on a lattice, in the order of `WaveFlag`; none for one that may be used as an arbiter.
 * `phaseStepWaves` is the largest step of the path between neighbouring lit cells (`LatticeValidity.phaseStep`),
 * `convergence` the figure of `gridConvergence` against the next coarser lattice, or null where there is none. A
 * figure that is no number is no convergence.
 */
export function waveFlags(phaseStepWaves: number, convergence: number | null, onAxis: boolean): WaveFlag[] {
  const flags: WaveFlag[] = [];
  if (!(phaseStepWaves <= QUARTER_WAVE)) flags.push("undersampled");
  if (convergence === null) flags.push("convergence-unknown");
  else if (!(convergence <= convergenceLimit(onAxis))) flags.push("not-converged");
  return flags;
}
