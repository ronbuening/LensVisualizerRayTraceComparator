// `mtf.native` of the engine `optiland` through its worker: optiland's own FFT MTF of the contract's Double-Gauss, asked
// as the comparator asks an engine. What the curves must be is derived in the worker's own tests
// (`workers/python/tests/optiland/test_mtf.py`, which this tier runs under the optiland interpreter); here the answer
// is held to the quantity's rules as the comparator checks them, to what a request states, and to itself: asked
// twice, of two workers, it is the same answer.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import type { OpticalCase } from "../../../src/contract/case.ts";
import type { MtfNativeData, MtfNativeSpec } from "../../../src/contract/quantities/mtfNative.ts";
import { MTF_NATIVE } from "../../../src/contract/quantities/mtfNative.ts";
import { makeRequest } from "../../../src/contract/request.ts";
import type { ResultEnvelope } from "../../../src/contract/result.ts";
import { canonicalJson } from "../../../src/core/numeric/canonicalJson.ts";
import { decodeNdArray, encodeF8 } from "../../../src/core/numeric/ndarray.ts";
import type { NdArrayWire } from "../../../src/core/numeric/ndarray.ts";
import { storeKey } from "../../../src/core/resultStore.ts";
import type { EngineAdapter } from "../../../src/engines/adapter.ts";
import { createEngineRegistry } from "../../../src/engines/registry.ts";
import { mtfNativeQuantity } from "../../../src/quantities/mtfNative.ts";
import { mtfTableRows } from "../../../src/report/mtfTable.ts";
import { DOUBLE_GAUSS, caseFixture } from "../../core/support.ts";
import { OPTILAND_UNAVAILABLE, optilandRoot } from "./support.ts";

const skip = OPTILAND_UNAVAILABLE;

/** The contract's case that has every feature: three lines and a finite object among them. */
const ALL_FEATURES: OpticalCase = JSON.parse(readFileSync(caseFixture("all-features"), "utf8"));

/** The axis, a field inside the image and one the lens does not pass, at the frequencies of the benchmark's table. */
const SPEC: MtfNativeSpec = {
  frequenciesPerMm: [10, 30, 50],
  fields: { kind: "angles-deg", values: [0, 10, 40] },
  method: "diffraction",
  focus: "design",
};

async function ask(
  adapter: EngineAdapter,
  opticalCase: OpticalCase,
  spec: MtfNativeSpec,
  engineOptions?: Record<string, number>,
): Promise<ResultEnvelope> {
  const request = makeRequest({ caseId: opticalCase.id, quantity: MTF_NATIVE, spec, engineOptions });
  return adapter.run(request, opticalCase);
}

function dataOf(result: ResultEnvelope): MtfNativeData {
  assert.equal(result.status, "ok", JSON.stringify(result.error ?? result.unsupported));
  assert.deepEqual(mtfNativeQuantity.validateData(result.data), []);
  return result.data as MtfNativeData;
}

test(
  "optiland's own MTF of the Double-Gauss: a row for each field, the one it cannot compute among them, twice the same",
  { skip, timeout: 600_000 },
  async (t) => {
    const loaded = optilandRoot(t);
    const adapter = await createEngineRegistry(loaded).create("optiland");
    t.after(() => adapter.close());
    const descriptor = await adapter.describe();
    assert.deepEqual(descriptor.capabilities.quantities[MTF_NATIVE], { version: mtfNativeQuantity.version });

    const result = await ask(adapter, DOUBLE_GAUSS, SPEC);
    const data = dataOf(result);
    assert.deepEqual(result.method, data.method);
    assert.equal(data.method.name, "scalar-fft-mtf");
    assert.deepEqual(data.method.params.numRays, [128, 256]);
    assert.deepEqual(data.focus, { mode: "design", appliedShiftMm: 0 });
    assert.deepEqual(data.lines, [{ wavelengthNm: 587.5618, weight: 1 }]);
    assert.deepEqual(result.diagnostics.counts, {
      surfaces: 11,
      lines: 1,
      fields: 3,
      ok: 2,
      unconverged: 0,
      unavailable: 1,
    });

    // The answer set beside its request, as a report would: one row for each field, in the order asked.
    const rows = mtfTableRows({ spec: SPEC, data, displayedFrequenciesPerMm: [10, 30, 50] });
    assert.deepEqual(
      rows.map((row) => [row.field, row.status]),
      [
        [0, "ok"],
        [10, "ok"],
        [40, "unavailable"],
      ],
    );
    const [axis, inside, lost] = rows;
    assert.deepEqual(
      axis.tangential.map((value) => typeof value),
      ["number", "number", "number"],
    );
    assert.deepEqual([lost.tangential, lost.sagittal], [Array(3).fill(null), Array(3).fill(null)]);
    assert.match(lost.reason ?? "", /^optiland-raised-\w+$/);
    // The chief ray of each field landed on the plane of the case, further out for the field further out; of the
    // field optiland has no MTF of, the landing is said where it has one.
    assert.ok((axis.imageHeightMm ?? 1) < 1e-9);
    assert.ok((inside.imageHeightMm ?? 0) > 17 && (inside.imageHeightMm ?? 0) < 18, String(inside.imageHeightMm));
    assert.deepEqual([axis.fieldAngleDeg, inside.fieldAngleDeg], [0, 10]);
    // The aperture optiland traced: the stop's own, of an f/5 lens.
    assert.equal(data.aperture.limitingSurfaceIndex, DOUBLE_GAUSS.system.stopIndex);
    assert.ok(Math.abs(data.aperture.tracedFNumber - 5) < 0.05, String(data.aperture.tracedFNumber));

    // The same request again, and of another worker: the same answer, to the byte.
    const again = await ask(adapter, DOUBLE_GAUSS, SPEC);
    assert.equal(canonicalJson(again.data), canonicalJson(result.data));
    const other = await createEngineRegistry(loaded).create("optiland");
    t.after(() => other.close());
    assert.equal(canonicalJson((await ask(other, DOUBLE_GAUSS, SPEC)).data), canonicalJson(result.data));
  },
);

test(
  "the 512 step is an option of the engine: another answer to the same request, kept under another key",
  { skip, timeout: 600_000 },
  async (t) => {
    const adapter = await createEngineRegistry(optilandRoot(t)).create("optiland");
    t.after(() => adapter.close());
    const { identity } = await adapter.describe();
    const spec: MtfNativeSpec = { ...SPEC, fields: { kind: "angles-deg", values: [0] } };
    const plain = makeRequest({ caseId: DOUBLE_GAUSS.id, quantity: MTF_NATIVE, spec });
    const finer = makeRequest({ caseId: DOUBLE_GAUSS.id, quantity: MTF_NATIVE, spec, engineOptions: { fftRays: 512 } });
    assert.equal(finer.id, plain.id, "an option is no part of what a request is");
    const keyOf = (request: typeof plain): string =>
      storeKey({
        requestId: request.id,
        engineId: identity.id,
        engineFingerprint: identity.fingerprint,
        adapterRevision: identity.adapterRevision,
        engineOptions: request.engineOptions,
      });
    assert.notEqual(keyOf(finer), keyOf(plain), "and the result store keeps the two answers apart");

    const [coarse] = dataOf(await adapter.run(plain, DOUBLE_GAUSS)).fields;
    const data = dataOf(await adapter.run(finer, DOUBLE_GAUSS));
    const [field] = data.fields;
    assert.deepEqual(data.method.params.numRays, [256, 512]);
    assert.deepEqual([field.sampling.numRays, field.sampling.gridSize, field.sampling.coarseNumRays], [512, 1024, 256]);
    assert.deepEqual([coarse.sampling.numRays, coarse.sampling.coarseNumRays], [256, 128]);
    assert.equal(field.status, "ok");
    // Twice the rays across the same pupil: the lag of one ray is half as wide, to the one ray the count is short of.
    const ratio = coarse.sampling.frequencyStepTangentialPerMm / field.sampling.frequencyStepTangentialPerMm;
    assert.ok(Math.abs(ratio - 511 / 255) < 1e-9, String(ratio));

    // A value the option does not have is refused, and so is what the engine has no method for.
    const refused = await ask(adapter, DOUBLE_GAUSS, { ...spec, method: "geometric" }, { fftRays: 1024 });
    assert.equal(refused.status, "unsupported");
    assert.deepEqual(
      refused.unsupported?.map((item) => [item.code, item.item]),
      [
        ["option", "method.geometric"],
        ["option", "option.fftRays"],
      ],
    );
  },
);

test(
  "a case of several lines is answered one line at a time, and a finite object not at all",
  { skip, timeout: 600_000 },
  async (t) => {
    const adapter = await createEngineRegistry(optilandRoot(t)).create("optiland");
    t.after(() => adapter.close());
    const spec: MtfNativeSpec = { ...SPEC, fields: { kind: "angles-deg", values: [0] } };
    // The contract's case of every feature has three lines and a finite object.
    assert.ok(ALL_FEATURES.conditions.lines.length > 1 && ALL_FEATURES.conditions.object.kind === "finite");
    const refused = await ask(adapter, ALL_FEATURES, spec);
    assert.equal(refused.status, "unsupported");
    assert.deepEqual(
      refused.unsupported?.map((item) => [item.code, item.item]),
      [
        ["feature", "lines.polychromatic"],
        ["feature", "object.finite"],
      ],
    );

    // The Double-Gauss with a second line of the same indices, at infinity: each line is an MTF, of that line.
    const lines = [...DOUBLE_GAUSS.conditions.lines, { ...DOUBLE_GAUSS.conditions.lines[0], wavelengthNm: 486.1327 }];
    const table = DOUBLE_GAUSS.conditions.indexAfterSurface;
    const two: OpticalCase = {
      ...DOUBLE_GAUSS,
      conditions: { ...DOUBLE_GAUSS.conditions, lines, indexAfterSurface: twoRows(table) },
    };
    const without = await ask(adapter, two, spec);
    assert.deepEqual(
      without.unsupported?.map((item) => item.item),
      ["lines.polychromatic"],
    );
    const red = dataOf(await ask(adapter, two, spec, { line: 0 }));
    const blue = dataOf(await ask(adapter, two, spec, { line: 1 }));
    assert.deepEqual([red.lines, blue.lines], [[lines[0]].map(lineOf), [lines[1]].map(lineOf)]);
    assert.equal(blue.method.params.line, 1);
    const step = (data: MtfNativeData): number => data.fields[0].sampling.frequencyStepTangentialPerMm;
    assert.ok(Math.abs(step(blue) / step(red) - 587.5618 / 486.1327) < 1e-9);
    assert.equal(blue.notes.at(-1), "of line 1 of the case alone, 486.1327 nm: no polychromatic MTF");
  },
);

/** The index table of a case of one line, with that line's row a second time. */
function twoRows(table: NdArrayWire): NdArrayWire {
  const row = Array.from(decodeNdArray(table).values as Float64Array);
  return encodeF8([...row, ...row], [2, row.length]);
}

function lineOf(line: { wavelengthNm: number; weight: number }): { wavelengthNm: number; weight: number } {
  return { wavelengthNm: line.wavelengthNm, weight: line.weight };
}
