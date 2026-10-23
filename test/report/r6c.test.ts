import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { MTF_BASELINE, buildBaseline } from "../../src/baseline/build.ts";
import { renderMtfBaselineReport } from "../../src/baseline/mtfReport.ts";
import { buildReport } from "../../src/report/model.ts";
import { WAVEFRONT_SEVERAL_LINES, severalLinesChiefLanding, wordingProblems } from "../../src/report/wording.ts";
import { goldenFile, mtfGoldenFile } from "./support.ts";
import { R6C_GOLDEN, R6C_POLICY, r6cCycle } from "./r6cFixture.ts";

test("R6c records four columns and sorts every difference independently; report and MTF stand-ins are golden", async () => {
  const root = mkdtempSync(join(tmpdir(), "lvrtc-r6c-"));
  try {
    const cycle = await r6cCycle(root);
    const model = buildReport(cycle.manifest, cycle.comparisons, R6C_POLICY);
    const tables = model.sections.flatMap((s) => s.mtf ?? []);
    for (const section of model.sections) {
      if (section.mtf?.lineCounts.some((count) => (count ?? 0) > 1)) {
        assert.equal(section.columns.find((column) => column.name === "chiefLanding.maxAbs")?.limit, 1e-3);
      }
    }
    assert.ok(tables.length > 0);
    for (const table of tables) {
      assert.deepEqual(
        table.columns.map((c) => c.engine),
        ["lv", "wave", "optiland", "optiland-wave"],
      );
      assert.equal(table.peers?.length, 2);
      assert.equal(table.pair.b, "optiland-wave");
    }
    const methods = tables.flatMap((t) => [t, ...(t.peers ?? [])]);
    for (const kind of ["unsupported", "data", "numerical", "method"])
      assert.ok(
        methods.some((t) => t.rows.some((r) => r.class === kind)),
        kind,
      );
    assert.ok(
      methods
        .flatMap((t) => t.rows)
        .filter((r) => r.class === "data" || r.class === "unsupported")
        .every((r) => r.difference === null),
    );
    assert.ok(
      methods
        .flatMap((t) => t.rows)
        .filter((r) => r.class === "numerical")
        .every((r) => r.band === null),
    );
    assert.equal(cycle.report.markdown.split(WAVEFRONT_SEVERAL_LINES.join("\n")).length - 1, 1);
    assert.ok(
      cycle.report.markdown.indexOf(WAVEFRONT_SEVERAL_LINES[0]) > cycle.report.markdown.indexOf("### polychromatic"),
    );
    const selectedLimitText = severalLinesChiefLanding("1.00e-3").join("\n");
    assert.equal(cycle.report.markdown.split(selectedLimitText).length - 1, 1);
    const photopic = tables.find((t) => (t.lineCounts[1] ?? 0) > 1);
    assert.ok(photopic);
    assert.ok(photopic.rows.every((r) => r.values[3] !== null && r.values[2] === null));
    assert.ok(photopic.peers?.find((t) => t.pair.a === "optiland")?.rows.every((r) => r.status === "UNSUPPORTED"));
    assert.deepEqual(wordingProblems(cycle.report.markdown), []);
    assert.equal(cycle.report.markdown, readFileSync(goldenFile(R6C_GOLDEN), "utf8"));
    const baseline = buildBaseline(cycle.manifest, cycle.comparisons, R6C_POLICY, MTF_BASELINE);
    const report = renderMtfBaselineReport(baseline);
    assert.equal(report.markdown, readFileSync(mtfGoldenFile(R6C_GOLDEN), "utf8"));
    assert.deepEqual(wordingProblems(report.markdown), []);
    assert.equal(report.markdown.split(selectedLimitText).length - 1, 1);
    assert.equal(report.markdown.split(WAVEFRONT_SEVERAL_LINES.join("\n")).length - 1, 1);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("R6c selects the answer's several-line chief limit and reports the same sorting from recorded values", async () => {
  const { compareGroup } = await import("../../src/compare/group.ts");
  const { mtfWavefrontComparator } = await import("../../src/compare/mtfWavefront.ts");
  const { factsOfField, factsOfRecorded } = await import("../../src/compare/mtfNative.ts");
  const { loadPolicy } = await import("../../src/compare/policyFile.ts");
  const { buildWavefrontComparison } = await import("../../src/report/mtfComparison.ts");
  const { SPEC, answer } = await import("../compare/mtfNativeSupport.ts");
  const { SINGLET } = await import("../core/support.ts");
  const policy = loadPolicy().rungs.r6c;
  assert.deepEqual(policy.metrics["chiefLanding.maxAbs"], {
    attention: 1e-7,
    attentionSeveralLines: 1e-3,
    unit: "mm",
  });
  for (const [lines, offset, expected, verdict] of [
    [[500, 600], 5e-6, "method", "RECORDED"],
    [[500], 5e-6, "data", "ATTENTION"],
    [[500, 600], 1.001e-3, "data", "ATTENTION"],
    [[500, 600], 1e-3, "method", "RECORDED"],
  ] as const) {
    // The case deliberately disagrees: only the answers select the limit.
    const opticalCase = {
      ...SINGLET,
      conditions: {
        ...SINGLET.conditions,
        lines: (lines.length > 1 ? [500] : [500, 600]).map((wavelengthNm) => ({
          ...SINGLET.conditions.lines[0],
          wavelengthNm,
          weight: 1,
        })),
      },
    };
    const a = answer("lv-product", [{}, { imageHeightMm: 0 }, {}], lines);
    const b = answer("hopkins-optiland-wavefront", [{}, { imageHeightMm: offset }, {}], lines);
    const group = compareGroup(
      {
        suite: "synthetic",
        run: "field",
        caseId: SINGLET.id,
        rung: "r6c",
        quantity: "mtf.native",
        requestId: "1".repeat(64),
        participants: [
          { engine: "lv", fingerprint: "lv", status: "ok", data: a },
          { engine: "optiland-wave", fingerprint: "raw", status: "ok", data: b },
        ],
        policy,
        comparator: mtfWavefrontComparator,
        context: { spec: SPEC, opticalCase },
      },
      "pairwise",
    );
    const pair = group.pairs[0];
    assert.equal(pair.verdict, verdict);
    const metric = (name: string) => pair.metrics.find((m) => m.name === name)?.value;
    assert.equal(metric("fields.data"), expected === "data" ? 1 : 0);
    assert.equal(metric("fields.compared"), expected === "data" ? 2 : 3);
    if (lines.length > 1 && offset === 5e-6) {
      const changedPolicy = {
        ...policy,
        metrics: {
          ...policy.metrics,
          "chiefLanding.maxAbs": { ...policy.metrics["chiefLanding.maxAbs"], attentionSeveralLines: 1e-6 },
        },
      };
      const changed = mtfWavefrontComparator.compare(a, b, { spec: SPEC, policy: changedPolicy });
      assert.ok(changed.comparable);
      assert.equal(changed.metrics.find((m) => m.name === "fields.data")?.value, 1);
    }
    const limit = lines.length > 1 ? 1e-3 : 1e-7;
    for (const participant of group.participants) {
      assert.deepEqual(participant.recorded?.chiefLandingLimitMm, [limit, limit, limit]);
      const data = participant.engine === "lv" ? a : b;
      assert.deepEqual(factsOfRecorded(participant.recorded ?? {}, 1), factsOfField(data.fields[1], limit));
    }
    const table = buildWavefrontComparison({ participants: group.participants, pairs: group.pairs, policy });
    assert.ok(table);
    assert.equal(table.bands.chiefLandingMm, limit);
    assert.equal(table.fields[1].class, expected);
    const rows = table.rows.filter((row) => row.field === 0.5);
    assert.ok(rows.every((row) => row.status === (expected === "data" ? "SET ASIDE" : "RECORDED")));
    assert.ok(rows.every((row) => row.difference === (expected === "data" ? null : 0)));
    // A baseline supplies only the ordinary rung bands. Recorded limits must still reproduce the selection.
    const { attentionSeveralLines: _several, ...oneLine } = policy.metrics["chiefLanding.maxAbs"];
    const historical = buildWavefrontComparison({
      participants: group.participants,
      pairs: group.pairs,
      policy: { ...policy, metrics: { ...policy.metrics, "chiefLanding.maxAbs": oneLine } },
    });
    assert.deepEqual(historical, table);
  }
});
