// Whether a lattice may carry a wave transfer function as an arbiter: the two limits, each held at its edge.
import assert from "node:assert/strict";
import { test } from "node:test";

import { QUARTER_WAVE } from "../../src/estimators/waveOtf.ts";
import { CONVERGENCE_BANDS, convergenceLimit, waveFlags } from "../../src/estimators/waveValidity.ts";

test("the convergence limits are the plan's bands: 0.005 on the axis and 0.01 off it", () => {
  assert.deepEqual(CONVERGENCE_BANDS, { onAxis: 0.005, offAxis: 0.01 });
  assert.ok(Object.isFrozen(CONVERGENCE_BANDS));
  assert.equal(convergenceLimit(true), 0.005);
  assert.equal(convergenceLimit(false), 0.01);
  assert.equal(QUARTER_WAVE, 0.25);
});

test("a lattice is an arbiter up to a quarter wave a cell and up to the band of its field, both inclusive", () => {
  assert.deepEqual(waveFlags(0, 0, true), []);
  assert.deepEqual(waveFlags(0.25, 0.005, true), []);
  assert.deepEqual(waveFlags(0.25, 0.01, false), []);
  // The next double above a limit is beyond it.
  const above = (value: number): number => value * (1 + 2 ** -52);
  assert.deepEqual(waveFlags(above(0.25), 0, true), ["undersampled"]);
  assert.deepEqual(waveFlags(0, above(0.005), true), ["not-converged"]);
  assert.deepEqual(waveFlags(0, above(0.005), false), []);
  assert.deepEqual(waveFlags(0, above(0.01), false), ["not-converged"]);
  assert.deepEqual(waveFlags(1, 1, false), ["undersampled", "not-converged"]);
});

test("without a coarser lattice the convergence is unknown, and a figure that is no number is no convergence", () => {
  assert.deepEqual(waveFlags(0, null, true), ["convergence-unknown"]);
  assert.deepEqual(waveFlags(0.3, null, false), ["undersampled", "convergence-unknown"]);
  assert.deepEqual(waveFlags(0, Number.NaN, true), ["not-converged"]);
  assert.deepEqual(waveFlags(Number.NaN, 0, true), ["undersampled"]);
});
