// Asking for a case again: whatever options a case was exported under, the options read back from the case give
// the same case. On prepared states built by hand, with stand-ins for LensVisualizer; the engine `lv` holds every
// case it is asked about to this, so a case that fails it without having changed would be refused as stale.
import assert from "node:assert/strict";
import { test } from "node:test";

import type { OpticalCase } from "../../../src/contract/case.ts";
import { exportOptionsOf } from "../../../src/engines/lv/caseModel.ts";
import { exportCase } from "../../../src/engines/lv/exportCase.ts";
import type { ExportOptions, LvExportApi } from "../../../src/engines/lv/exportCase.ts";
import type { LvPreparedState } from "../../../src/engines/lv/types.ts";
import { LINES_NM, TRIPLET, gate, inputFor, stateOf } from "./exportSupport.ts";

function caseOf(state: LvPreparedState, options: ExportOptions, overrides: Partial<LvExportApi> = {}): OpticalCase {
  const result = exportCase(inputFor(state, options, overrides));
  assert.ok(result.ok, JSON.stringify(result));
  return result.opticalCase;
}

/** Exports a state under `options`, then again under the options read back from that case. */
function twice(
  options: ExportOptions,
  overrides: Partial<LvExportApi> = {},
  state = stateOf(TRIPLET, { stopIndex: 2 }),
) {
  const first = caseOf(state, options, overrides);
  const again = caseOf(state, exportOptionsOf(first, state.zoomT, state.focusT), overrides);
  return { first, again };
}

test("the options read back from a case ask for the same case, whatever it was exported under", () => {
  const exports: [string, ExportOptions][] = [
    ["defaults", {}],
    ["the reference line", { lines: { kind: "reference" } }],
    ["the photopic lines", { lines: { kind: "photopic" } }],
    ["the C/d/F lines", { lines: { kind: "cdf" } }],
    ["explicit lines", { lines: { kind: "explicit", wavelengthsNm: [520, 640, 450], weights: [3, 1, 2] } }],
    ["explicit lines that weigh the same", { lines: { kind: "explicit", wavelengthsNm: [LINES_NM.d] } }],
    ["an f-number", { aperture: { kind: "f-number", value: 5.6 } }],
    ["the widest f-number, by number", { aperture: { kind: "f-number", value: 2 } }],
    ["a stop radius", { aperture: { kind: "stop-radius", mm: 1.2345678901234567 } }],
    ["a shift", { imagePlane: { kind: "shift", mm: 0.1 + 0.2 } }],
    ["a shift beyond the lens itself", { imagePlane: { kind: "shift", mm: -80.123456789 } }],
    [
      "all of it",
      {
        aperture: { kind: "f-number", value: 4 },
        lines: { kind: "photopic" },
        imagePlane: { kind: "shift", mm: -0.037 },
      },
    ],
  ];
  for (const [name, options] of exports) {
    const { first, again } = twice(options);
    assert.equal(again.systemId, first.systemId, name);
    assert.equal(again.id, first.id, name);
    assert.deepEqual(again.conditions, first.conditions, name);
  }
});

test("a mixed-reference lens, whose one line is anchored, and a refocused state are asked for again alike", () => {
  const mixed = twice({}, { assessMtfSupport: gate({ mixed: true }) });
  assert.deepEqual(
    mixed.first.conditions.lines.map((line) => line.indexSource),
    ["anchored"],
  );
  assert.equal(mixed.again.id, mixed.first.id);

  const conjugate = { focusT: 1, zoomT: 0.5, objectDistanceMm: 650, distanceReference: "first-surface" };
  const state = stateOf(TRIPLET, { stopIndex: 2, focusT: 1, zoomT: 0.5 });
  const close = twice({ lines: { kind: "cdf" } }, { assessMtfSupport: gate({ conjugate }) }, state);
  assert.deepEqual(close.first.conditions.object, { kind: "finite", z: -650 });
  assert.equal(close.again.id, close.first.id);
});

test("the options state the case's own stop radius, image plane and lines, and the state they are given", () => {
  const { first } = twice({ aperture: { kind: "f-number", value: 4 }, imagePlane: { kind: "shift", mm: 0.5 } });
  assert.deepEqual(exportOptionsOf(first, 0.25, 0), {
    state: { zoomT: 0.25, focus: { kind: "focusT", value: 0 } },
    aperture: { kind: "stop-radius", mm: first.conditions.stopSemiDiameter },
    lines: { kind: "reference" },
    imagePlane: { kind: "at", z: 42.5 },
  });
  const { first: photopic } = twice({ lines: { kind: "photopic" } });
  assert.deepEqual(exportOptionsOf(photopic, 0, 0).lines, {
    kind: "explicit",
    wavelengthsNm: [555, 470, 510, 610, 650],
    weights: [1, 0.091, 0.503, 0.503, 0.107],
  });
});
